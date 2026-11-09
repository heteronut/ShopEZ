using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

internal sealed class ShopEZLauncher : Form
{
    private const int ApiPort = 3001;
    private const int WebPort = 5173;
    private string _storeUrl = "http://127.0.0.1:5173/";

    private readonly string _root = AppDomain.CurrentDomain.BaseDirectory;
    private readonly string _logDirectory = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "ShopEZ",
        "logs");
    private readonly object _logLock = new object();
    private readonly CancellationTokenSource _startupCancellation = new CancellationTokenSource();
    private readonly Label _status;
    private readonly Button _openButton;
    private readonly Button _stopButton;
    private readonly Button _startButton;
    private Process _apiProcess;
    private Process _webProcess;
    private bool _allowClose;
    private bool _closing;

    internal ShopEZLauncher()
    {
        Text = "ShopEZ";
        Width = 520;
        Height = 290;
        MinimumSize = new Size(480, 270);
        StartPosition = FormStartPosition.CenterScreen;
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        Font = new Font("Segoe UI", 10F);

        Label title = new Label();
        title.Text = "ShopEZ";
        title.Font = new Font("Segoe UI", 22F, FontStyle.Bold);
        title.AutoSize = true;
        title.Location = new Point(24, 20);
        Controls.Add(title);

        _status = new Label();
        _status.Text = "Starting ShopEZ...";
        _status.AutoSize = false;
        _status.Location = new Point(27, 74);
        _status.Size = new Size(440, 46);
        Controls.Add(_status);

        Label note = new Label();
        note.Text = "Local demo. Data resets when ShopEZ closes.";
        note.AutoSize = true;
        note.ForeColor = Color.FromArgb(86, 82, 88);
        note.Location = new Point(27, 121);
        Controls.Add(note);

        _openButton = new Button();
        _openButton.Text = "Open store";
        _openButton.Location = new Point(27, 164);
        _openButton.Size = new Size(130, 42);
        _openButton.Enabled = false;
        _openButton.Click += OpenStoreClicked;
        Controls.Add(_openButton);

        _startButton = new Button();
        _startButton.Text = "Start again";
        _startButton.Location = new Point(167, 164);
        _startButton.Size = new Size(125, 42);
        _startButton.Visible = false;
        _startButton.Click += StartAgainClicked;
        Controls.Add(_startButton);

        _stopButton = new Button();
        _stopButton.Text = "Stop and close";
        _stopButton.Location = new Point(302, 164);
        _stopButton.Size = new Size(150, 42);
        _stopButton.Enabled = false;
        _stopButton.Click += StopClicked;
        Controls.Add(_stopButton);

        Label accounts = new Label();
        accounts.Text = "Demo admin: admin@shopez.in / admin123     Customer: customer@shopez.in / customer123";
        accounts.AutoSize = false;
        accounts.Size = new Size(440, 34);
        accounts.Font = new Font("Segoe UI", 8.5F);
        accounts.ForeColor = Color.FromArgb(86, 82, 88);
        accounts.Location = new Point(27, 220);
        Controls.Add(accounts);
    }

    protected override async void OnShown(EventArgs e)
    {
        base.OnShown(e);
        await StartShopAsync();
    }

    private async Task StartShopAsync()
    {
        _startButton.Visible = false;
        _startButton.Enabled = false;
        _openButton.Enabled = false;
        _stopButton.Enabled = true;

        Exception startupError = null;
        try
        {
            Directory.CreateDirectory(_logDirectory);
            bool apiAlreadyRunning = await Task.Run(delegate { return IsShopEZApi(); });
            bool webAlreadyRunning = await Task.Run(delegate { return IsShopEZWeb(); });
            if (!apiAlreadyRunning || !webAlreadyRunning) EnsureDependencies();
            if (!apiAlreadyRunning) EnsurePortAvailable(ApiPort);
            if (!webAlreadyRunning) EnsurePortAvailable(WebPort);

            string node = apiAlreadyRunning && webAlreadyRunning ? null : FindNode();
            if (apiAlreadyRunning)
            {
                AppendLog("launcher", "Reusing the existing local ShopEZ API.");
            }
            else
            {
                SetStatus("Starting the demo database and API...");
                _apiProcess = StartNode(
                    node,
                    Path.Combine(_root, "server", "dev-memory.js"),
                    Path.Combine(_root, "server"),
                    "server",
                    true);
            }

            if (webAlreadyRunning)
            {
                _storeUrl = "http://localhost:" + WebPort + "/";
                AppendLog("launcher", "Reusing the existing local ShopEZ website.");
            }
            else
            {
                SetStatus("Starting the website...");
                _webProcess = StartNode(
                    node,
                    Path.Combine(_root, "client", "node_modules", "vite", "bin", "vite.js"),
                    Path.Combine(_root, "client"),
                    "web",
                    false,
                    "--host 127.0.0.1 --strictPort");
            }

            SetStatus("Waiting for the API and website. First startup may download the demo database.");
            bool ready = false;
            for (int attempt = 0; attempt < 180; attempt++)
            {
                _startupCancellation.Token.ThrowIfCancellationRequested();
                if (_apiProcess != null && _apiProcess.HasExited)
                    throw new InvalidOperationException("The API stopped unexpectedly. Check the launcher log.");
                if (_webProcess != null && _webProcess.HasExited)
                    throw new InvalidOperationException("The website stopped unexpectedly. Check the launcher log.");

                bool apiReady = await Task.Run(delegate
                {
                    return IsAvailable("http://127.0.0.1:" + ApiPort + "/api/health");
                });
                bool webReady = await Task.Run(delegate
                {
                    return IsAvailable(_storeUrl);
                });
                if (apiReady && webReady)
                {
                    ready = true;
                    break;
                }
                await Task.Delay(1000, _startupCancellation.Token);
            }

            if (!ready)
                throw new TimeoutException("ShopEZ did not start within 3 minutes. Check the launcher log.");

            SetStatus("ShopEZ is ready at http://127.0.0.1:5173");
            _openButton.Enabled = true;
            try
            {
                OpenStore();
            }
            catch (System.ComponentModel.Win32Exception ex)
            {
                AppendLog("launcher", "Could not open the default browser: " + ex.Message);
                SetStatus("ShopEZ is ready. Select Open store to launch your browser.");
            }
        }
        catch (OperationCanceledException)
        {
            SetStatus("Stopping ShopEZ...");
        }
        catch (Exception ex)
        {
            startupError = ex;
        }

        if (startupError != null)
        {
            AppendLog("launcher", startupError.ToString());
            SetStatus("ShopEZ could not start. See the launcher log for details.");
            await StopServicesAsync();
            if (!_closing)
            {
                _startButton.Visible = true;
                _startButton.Enabled = true;
                _stopButton.Enabled = false;
                MessageBox.Show(
                    this,
                    startupError.Message + Environment.NewLine + Environment.NewLine + "Log: " + Path.Combine(_logDirectory, "launcher.log"),
                    "ShopEZ could not start",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error);
            }
        }
    }

    private void EnsureDependencies()
    {
        string serverDependency = Path.Combine(_root, "server", "node_modules", "mongodb-memory-server", "package.json");
        string webDependency = Path.Combine(_root, "client", "node_modules", "vite", "bin", "vite.js");
        if (!File.Exists(serverDependency) || !File.Exists(webDependency))
        {
            throw new FileNotFoundException(
                "Project dependencies are missing. Run 'npm install' in both the server and client folders, then launch ShopEZ.exe again.");
        }
    }

    private static string FindNode()
    {
        string path = Environment.GetEnvironmentVariable("PATH") ?? "";
        string[] directories = path.Split(Path.PathSeparator);
        for (int i = 0; i < directories.Length; i++)
        {
            string directory = directories[i].Trim();
            if (directory.Length == 0) continue;
            string candidate = Path.Combine(directory.Trim('"'), "node.exe");
            if (File.Exists(candidate)) return candidate;
        }
        throw new FileNotFoundException("Node.js 18 or newer is required. Install Node.js, then start ShopEZ.exe again.");
    }

    private static void EnsurePortAvailable(int port)
    {
        TcpListener listener = new TcpListener(System.Net.IPAddress.Loopback, port);
        try
        {
            listener.Start();
            listener.Stop();
        }
        catch (SocketException)
        {
            listener.Stop();
            throw new InvalidOperationException(
                "Port " + port + " is already in use. Close the other app using that port and try again. ShopEZ will not stop another app.");
        }
    }

    private static bool IsShopEZApi()
    {
        try
        {
            string health = ReadResponseBody("http://127.0.0.1:" + ApiPort + "/api/health");
            string products = ReadResponseBody("http://127.0.0.1:" + ApiPort + "/api/products");
            return health.IndexOf("\"status\"", StringComparison.Ordinal) >= 0
                && health.IndexOf("\"ok\"", StringComparison.Ordinal) >= 0
                && products.IndexOf("\"title\"", StringComparison.Ordinal) >= 0
                && products.IndexOf("\"category\"", StringComparison.Ordinal) >= 0;
        }
        catch (WebException)
        {
            return false;
        }
    }

    private static bool IsShopEZWeb()
    {
        try
        {
            string html = ReadResponseBody("http://localhost:" + WebPort + "/");
            return html.IndexOf("<title>ShopEZ", StringComparison.OrdinalIgnoreCase) >= 0
                && html.IndexOf("/src/main.jsx", StringComparison.Ordinal) >= 0;
        }
        catch (WebException)
        {
            return false;
        }
    }

    private static string ReadResponseBody(string url)
    {
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
        request.Method = "GET";
        request.Timeout = 1500;
        request.ReadWriteTimeout = 1500;
        using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
        using (StreamReader reader = new StreamReader(response.GetResponseStream()))
        {
            return reader.ReadToEnd();
        }
    }

    private Process StartNode(string node, string script, string workingDirectory, string name, bool launcherControl, string extraArguments = "")
    {
        ProcessStartInfo startInfo = new ProcessStartInfo();
        startInfo.FileName = node;
        startInfo.Arguments = Quote(script) + (extraArguments.Length == 0 ? "" : " " + extraArguments);
        startInfo.WorkingDirectory = workingDirectory;
        startInfo.UseShellExecute = false;
        startInfo.CreateNoWindow = true;
        startInfo.RedirectStandardOutput = true;
        startInfo.RedirectStandardError = true;
        startInfo.RedirectStandardInput = launcherControl;
        if (launcherControl)
        {
            startInfo.EnvironmentVariables["SHOPEZ_LAUNCHER"] = "1";
            startInfo.EnvironmentVariables["PORT"] = ApiPort.ToString();
        }

        Process process = new Process();
        process.StartInfo = startInfo;
        process.EnableRaisingEvents = true;
        process.OutputDataReceived += delegate(object sender, DataReceivedEventArgs args)
        {
            if (args.Data != null) AppendLog(name, args.Data);
        };
        process.ErrorDataReceived += delegate(object sender, DataReceivedEventArgs args)
        {
            if (args.Data != null) AppendLog(name, args.Data);
        };
        if (!process.Start())
            throw new InvalidOperationException("Could not start the " + name + " process.");
        process.BeginOutputReadLine();
        process.BeginErrorReadLine();
        AppendLog("launcher", "Started " + name + " process (PID " + process.Id + ").");
        return process;
    }

    private static string Quote(string value)
    {
        return "\"" + value.Replace("\"", "\\\"") + "\"";
    }

    private static bool IsAvailable(string url)
    {
        try
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            request.Timeout = 1500;
            request.ReadWriteTimeout = 1500;
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                return (int)response.StatusCode >= 200 && (int)response.StatusCode < 400;
            }
        }
        catch (WebException)
        {
            return false;
        }
    }

    private void OpenStore()
    {
        Process.Start(new ProcessStartInfo(_storeUrl) { UseShellExecute = true });
    }

    private void OpenStoreClicked(object sender, EventArgs e)
    {
        try
        {
            OpenStore();
        }
        catch (System.ComponentModel.Win32Exception ex)
        {
            MessageBox.Show(this, ex.Message, "Could not open the browser", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private async void StartAgainClicked(object sender, EventArgs e)
    {
        await StartShopAsync();
    }

    private async void StopClicked(object sender, EventArgs e)
    {
        _closing = true;
        _startupCancellation.Cancel();
        _status.Text = "Stopping ShopEZ...";
        _stopButton.Enabled = false;
        await StopServicesAsync();
        _allowClose = true;
        Close();
    }

    protected override void OnFormClosing(FormClosingEventArgs e)
    {
        if (!_allowClose)
        {
            e.Cancel = true;
            if (!_closing)
            {
                _closing = true;
                _startupCancellation.Cancel();
                _status.Text = "Stopping ShopEZ...";
                _stopButton.Enabled = false;
                FinishCloseAsync();
            }
            return;
        }
        base.OnFormClosing(e);
    }

    private async void FinishCloseAsync()
    {
        await StopServicesAsync();
        _allowClose = true;
        Close();
    }

    private async Task StopServicesAsync()
    {
        await StopProcessAsync(_webProcess, false);
        await StopProcessAsync(_apiProcess, true);
        _webProcess = null;
        _apiProcess = null;
    }

    private async Task StopProcessAsync(Process process, bool requestGracefulStop)
    {
        if (process == null) return;
        try
        {
            if (process.HasExited) return;
            if (requestGracefulStop)
            {
                process.StandardInput.WriteLine("stop");
                process.StandardInput.Flush();
                for (int attempt = 0; attempt < 40 && !process.HasExited; attempt++)
                    await Task.Delay(250);
            }
            if (!process.HasExited) process.Kill();
            await Task.Run(delegate { process.WaitForExit(); });
            AppendLog("launcher", "Stopped process " + process.Id + ".");
        }
        catch (InvalidOperationException)
        {
            // The process may exit between the status check and the stop request.
        }
        catch (IOException ex)
        {
            AppendLog("launcher", "Process shutdown communication failed: " + ex.Message);
            if (!process.HasExited) process.Kill();
        }
        finally
        {
            process.Dispose();
        }
    }

    private void AppendLog(string source, string message)
    {
        try
        {
            lock (_logLock)
            {
                Directory.CreateDirectory(_logDirectory);
                File.AppendAllText(
                    Path.Combine(_logDirectory, "launcher.log"),
                    DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " [" + source + "] " + message + Environment.NewLine);
            }
        }
        catch (IOException ex)
        {
            SetStatus("Could not write launcher logs: " + ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            SetStatus("Could not write launcher logs: " + ex.Message);
        }
    }

    private void SetStatus(string message)
    {
        if (InvokeRequired)
        {
            BeginInvoke(new Action<string>(SetStatus), message);
            return;
        }
        _status.Text = message;
    }

    [STAThread]
    private static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;
        Application.Run(new ShopEZLauncher());
    }
}
