<!DOCTYPE html>
<html lang="en">
    <head>
        <title>CCR Scoring</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/scripts/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Roboto:500">
        <?php echo '<link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/home/home.css?' . filemtime('home.css') . '" />'; ?>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script type="text/javascript" src="http://www.ccrscoring.co.nz/scripts/js/bootstrap.min.js"></script>
        <?php echo '<script type="text/javascript" src="http://www.ccrscoring.co.nz/home/home.js?' . filemtime('home.js') . '"></script>'; ?>
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
                            <li class="home active" onclick="drawResults(true)"><a>Home</a></li>
                            <li class="tutorials" onclick="liveScoring(true)"><a>Tutorials</a></li>
                            <li class="suggestions" onclick="endScoring(true)"><a>Suggestions</a></li>
                            <li class="problems" onclick="showContactContainer()"><a>Contact</a></li>
                            <li class="about" onclick="showContactContainer()"><a>Contact</a></li>
                            <li class="contact" onclick="showContactContainer()"><a>Contact</a></li>
                        </ul>
                        <img id="infoButtonDesktop" src="http://www.ccrscoring.co.nz/images/info.png" alt="info button" onclick="toggleInstructions()">
                    </div>
                </div>
            </nav>
        </header>
        
        <main>     
        </main>
      
        <footer>
        </footer>
      
    </body>
</html>