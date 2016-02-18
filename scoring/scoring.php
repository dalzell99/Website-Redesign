<!DOCTYPE html>
<html lang="en">
    <head>
        <title>CCR Scoring</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/scripts/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/scripts/css/classic.min.css">
        <link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/scripts/css/classic.date.min.css">
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:500">
        <link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/scoring/scoring.css">
        <?php echo '<link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/scoring/scoring.css?' . filemtime('scoring.css') . '" />'; ?>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script type="text/javascript" src="http://www.ccrscoring.co.nz/scripts/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="http://www.ccrscoring.co.nz/scripts/js/picker.min.js"></script>
        <script type="text/javascript" src="http://www.ccrscoring.co.nz/scripts/js/picker.date.min.js"></script>
        <?php echo '<script type="text/javascript" src="http://www.ccrscoring.co.nz/scoring/scoring.min.js?' . filemtime('scoring.min.js') . '"></script>'; ?>
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
                            <span class="icon-bar"></span>
                        </button>
                        <a href="" class="navbar-brand">CCR Scoring</a>
                        <img id="infoButtonMobile" src="http://www.ccrscoring.co.nz/images/info.png" alt="info button" onclick="toggleInstructions()">
                    </div>
                    <div class="navbar-collapse collapse">
                        <ul class="nav navbar-nav">
                            <li class="drawResults active" onclick="drawResults(true)"><a>Draw/Results</a></li>
                            <li class="liveScoring" onclick="liveScoring(true)"><a>Live Score</a></li>
                            <li class="endScoring" onclick="endScoring(true)"><a>End Game Score</a></li>
                            <li class="contact" onclick="showContactContainer()"><a>Contact</a></li>
                        </ul>
                        <img id="infoButtonDesktop" src="http://www.ccrscoring.co.nz/images/info.png" alt="info button" onclick="toggleInstructions()">
                    </div>
                </div>
            </nav>
        </header>
        
        <main>
            <!-- Span used to display instructions on each page. Javascript will be used to populate this. -->
            <div id="instructions"></div>

            <!-----------------------------------------------------------------
            --------------------- Draw/Results Containers ---------------------
            ------------------------------------------------------------------>

            <div id="drawResultsContainer">
                <!-- Div used to display team lists grouped by division. Is populated by javascript and external php script -->
                <div id="changedGamesContainer"></div>
                <div id="gameCancellationContainer"></div>
                <div id="weekSelectorContainer"></div>
                <div id="gameContainer"></div>
            </div>

            <div id="gameInfoContainer">
            </div>
            
            <div id="pointsTableDialog"></div>

            <!-----------------------------------------------------------------
            --------------------- Live Scoring Containers ---------------------
            ------------------------------------------------------------------>

            <div id="liveScoringPasswordContainer">
                <!-- Password input-->
                <div id="liveScoringPasswordInputRow">Password: <input type="text" id="liveScoringPasswordInput"></div>
                <button type="submit" id="checkLiveScoringPasswordButton" onclick="checkLiveScoringPassword()">Submit</button>
            </div>

            <div id="gameSelectionContainer">
            </div>

            <div id="liveScoringContainer">
            </div>
            
            <div id="dialog" style="display: none">Was the conversion successful?</div>

            <!-----------------------------------------------------------------
            ------------------- End Game Scoring Containers -------------------
            ------------------------------------------------------------------>

            <div id="endScoringPasswordContainer">
                <!-- Password input -->
                <div id="endScoringPasswordInputRow">Password: <input type="text" id="endScoringPasswordInput"></div>
                <button type="submit" id="checkEndScoringPasswordButton" onclick="checkEndScoringPassword()">Submit</button>
            </div>

            <div id="endScoringContainer">
            </div>

            <!-----------------------------------------------------------------
            ------------------------ Contact Container ------------------------
            ------------------------------------------------------------------>

            <div id="contactContainer">
                <div><div class="contactFormLabel">Name</div><input type="text" id="contactFormName"></div>
                <div><div class="contactFormLabel">Email</div><input type="text" id="contactFormEmail"></div>
                <div><div class="contactFormLabel">Message</div><textarea id="contactFormMessage" rows="3"></textarea></div>
                <button type="submit" id="contactFormButton" onclick="submitContactForm()">Submit</button>
            </div>
        </main>
      
        <footer>
            <nav class="navbar navbar-default navbar-fixed-bottom footer">
                <div id="alertDiv"></div>
            </nav>
        </footer>
      
    </body>
</html>