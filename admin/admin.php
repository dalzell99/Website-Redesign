<!DOCTYPE html>
<html lang="en">
    <head>
        <title>CCR Admin</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/scripts/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/scripts/css/classic.min.css">
        <link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/scripts/css/classic.date.min.css">
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:500">
        <?php echo '<link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/admin/admin.css?' . filemtime('admin.css') . '" />'; ?>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script type="text/javascript" src="http://www.ccrscoring.co.nz/scripts/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="http://www.ccrscoring.co.nz/scripts/js/picker.min.js"></script>
        <script type="text/javascript" src="http://www.ccrscoring.co.nz/scripts/js/picker.date.min.js"></script>
        <script type="text/javascript" src="http://www.ccrscoring.co.nz/scripts/js/sorttable.js"></script>
        <?php echo '<script type="text/javascript" src="http://www.ccrscoring.co.nz/admin/admin.min.js?' . filemtime('admin.min.js') . '"></script>'; ?>
    </head>
    <body>
        <header>
            <nav class="navbar navbar-default navbar-fixed-top">
                <div class="container">
                    <div class="navbar-header">
                        <button type="button" data-toggle="collapse" data-target=".navbar-collapse" class="navbar-toggle collapsed">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a href="#" class="navbar-brand">CCR Admin</a>
                        <img id='infoButtonMobile' src='http://www.ccrscoring.co.nz/images/info.png' alt='info button' onclick='toggleInstructions()'>
                    </div>
                    <div class="navbar-collapse collapse">
                        <ul class="nav navbar-nav">
                            <li class="teamEditor active" onclick='teamEditor(true)'><a>Team Editor</a></li>
                            <li class="gameEditor" onclick='gameEditor(true)'><a>Game Editor</a></li>
                            <li class="contact" onclick='showContactContainer()'><a>Contact</a></li>
                        </ul>
                        <img id='infoButtonDesktop' src='http://www.ccrscoring.co.nz/images/info.png' alt='info button' onclick='toggleInstructions()'>
                    </div>
                </div>
            </nav>
        </header>
        
        <main>
            <div id='loadingMessage'>Loading</div>

            <!-- Span used to display instructions on each page. Javascript will be used to populate this. -->
            <div id='instructions' title='hello'></div>

            <div id='passwordContainer'>
                <!-- Password input -->
                <div id='passwordInputRow'>Password: <input type='text' id='passwordInput'></div>
                <button type='submit' id='checkPasswordButton' onclick='checkPassword()'>Submit</button>
            </div>

            <div id='teamEditorContainer'>
                <!-- Div used to display team lists grouped by division. Is populated by javascript and external php script -->
                <div id='addTeamContainer'></div>
                <div id='teamListContainer'></div>
            </div>

            <div id='gameEditorContainer'>
                <div id='gameEditorToolbar'></div>
                <div id='gameEditorTable'><div id='tablePlaceholderText'>Table is being created</div></div>
            </div>

            <!-----------------------------------------------------------------
            ------------------------ Contact Container ------------------------
            ------------------------------------------------------------------>

            <div id='contactContainer'>
                <div><div class='contactFormLabel'>Name</div><input type='text' id='contactFormName'></div>
                <div><div class='contactFormLabel'>Email</div><input type='text' id='contactFormEmail'></div>
                <div><div class='contactFormLabel'>Message</div><textarea id='contactFormMessage' rows="3"></textarea></div>
                <button type='submit' id='contactFormButton' onclick='submitContactForm()'>Submit</button>
            </div>
        </main>
        
        <footer>
            <nav class="navbar navbar-default navbar-fixed-bottom footer">
                <div id='alertDiv'></div>
            </nav>
        </footer>
    </body>
</html>