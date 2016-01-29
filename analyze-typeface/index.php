<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Typeface Analyzer</title>
    <style type="text/css">
        * { box-sizing: border-box; }
        .type {
            position: relative;
            display: block;
            border: #eee 3px solid;
            margin: 30px 0;
            width: 100%;
            height: 300px;
            overflow: hidden;
        }
        .font {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            height: 300px;
            white-space: nowrap;
            font-size: 300px;
            line-height: 300px;
        }
        .drag,
        .handle {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 600px;
        }
        .handle {
            border-bottom: red 300px solid;
            cursor: default;
        }
    </style>
    <style type="text/css" id="import"></style>
    <script type="text/javascript" src="http://code.jquery.com/jquery-2.2.0.min.js"></script>
    <script type="text/javascript" src="jquery-ui.min.js"></script>
    <script type="text/javascript">
        $(function() {
            function update() {
                $('#baseline').text(1 - ($('.drag .handle').position().top / -300));
            }
            $('.drag .handle').draggable({
                axis:           'y',
                containment:    [$('.drag').offset().left, $('.drag').offset().top - 300, $('.drag').offset().left + 1, $('.drag').offset().top],
                drag:           update
            });
            $('.up').on('click', function(e) {
                e.preventDefault();
                $('.drag .handle').css('top', parseInt($('.drag .handle').css('top')) - 1);
                update();
            });
            $('.down').on('click', function(e) {
                e.preventDefault();
                $('.drag .handle').css('top', parseInt($('.drag .handle').css('top')) + 1);
                update();
            });
            $('.import').on('change', function() {
                var val         = $(this).val().match(/\?family=([^:|\)']+)/)[1].replace(/\+/, ' ');
                $('#import').html($(this).val());
                $('.font').css('font-family', val);
                console.log('ok', val);
            });
        });
    </script>
</head>
<body>
<p>Paste your font import (CSS):</p>
<input type="text" style="width:560px;" class="import" value="" />
fine: <button class="up">up</button> | <button class="down">down</button>
<div class="type">
    <div class="font">AaBbCcQqXxZz</div>
    <div class="drag"><div class="handle"></div></div>
</div>
<p>Your baseline is <strong id="baseline">1</strong></p>
<p>Drag the handle until you cover everything under the baseline as shown below:</p>
<img src="https://i.imgur.com/cx7dTXN.png" alt="" />
</body>
</html>