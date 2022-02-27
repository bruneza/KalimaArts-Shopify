jQuery(document).ready(function ($) {

    /******
    *** BRU SLIDER JS
    *****/

    // Slide Auto Play
    function activateSlider(index = 0) {

        window.console.log("in activate " + index + "\n");

        var selSlider = $('.slide').eq(index);
        var selBullet = $('.bru-slider-nav li').eq(index);

        $('.slide').not(selSlider).removeClass('active');
        $('.bru-slider-nav li').not(selBullet).removeClass('active');


        selSlider.css("display", "flex").fadeIn(500).addClass('active');
        selBullet.addClass('active');

    }

    function auto_zoom(sliderIndex = 0) {

        activateSlider(sliderIndex);
        window.console.log("Selected slide is" + sliderIndex + "\n");
        // window.console.log("BULLET slide index is " + $(".slide.active").index() + "\n");
        bruInterval = setInterval(function () {
            
            kalimaFade($('.slide.active'));
        }, 5000);
    }
    auto_zoom();

    function kalimaFade(currSlider) {

        var bulletIndex = currSlider.index()+1;
        if(bulletIndex >= $('.slide').length){
            bulletIndex = 0;
        }
        // window.console.log($('.slide').length + "BULLET slide index is " + bulletIndex + "\n");
        var selBullet = $('.bru-slider-nav li').eq(bulletIndex);
        $('.bru-slider-nav li').not(selBullet).removeClass('active');
        selBullet.addClass('active');

        var currSliderIndex = currSlider.index();
        var nextSlider = currSlider.next();
        var nextSliderIndex = nextSlider.index();
        
        $('.slide').not(currSlider).removeClass('active');

        currSlider.fadeOut(500).removeClass("active");

        if (nextSlider.length == 0) {
            $('.slide').first().css("display", "flex").fadeIn().addClass('active').end();
        }
        else{
            nextSlider.css("display", "flex").fadeIn().addClass('active').end();
        }
        
    }


    function clearAuto() {
        clearInterval(bruInterval);
    }

    $('.bru-slider-nav li').click(function () {

        clearAuto();
        auto_zoom($(this).index());

    });

});
