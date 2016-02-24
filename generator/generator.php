<!DOCTYPE html>
<html lang="en">
    <head>
        <title>CCR Scoring</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/scripts/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/scripts/css/xcode.css">
        <link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Roboto:500">
        <link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/generator/generator.css">
        <?php echo '<link rel="stylesheet" type="text/css" href="http://www.ccrscoring.co.nz/generator/generator.css?' . filemtime('generator.css') . '" />'; ?>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script type="text/javascript" src="http://www.ccrscoring.co.nz/scripts/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="http://www.ccrscoring.co.nz/scripts/js/highlight.pack.js"></script>
        <?php echo '<script type="text/javascript" src="http://www.ccrscoring.co.nz/generator/generator.js?' . filemtime('generator.js') . '"></script>'; ?>
    </head>
    <body>
        <header>
        </header>
        
        <main>            
            <!-- Span used to display instructions on each page. Javascript will be used to populate this. -->
            <div id="instructions"></div>

            <!-----------------------------------------------------------------
            --------------------- Draw/Results Containers ---------------------
            ------------------------------------------------------------------>

            <div id="teamListContainer"></div>
            
            <div id="cssEditorContainer"></div>
            
            <div id="codePreviewContainer"></div>
            
            <div id="codeDisplayContainer"></div>
        </main>
      
        <footer>
        </footer>
      
    </body>
</html>