jQuery(document).ready(function ($) {

/******
*** BRU SLIDER JS
*****/

    // Slide Auto Play

    function auto_zoom() {
        bruInterval = setInterval(function () {
            kalimaFade();
        }, 5000);
    }
    auto_zoom();

    function kalimaFade() {
        var currentSlide = $('.slide.active');
        var nextSlide = currentSlide.next();
        currentSlide.fadeOut(1000).removeClass('active');
        nextSlide.fadeIn().addClass('active');

        $('.slide:not(.active)').show();

        if (nextSlide.length == 0) {
            $('.slide').first().fadeIn().addClass('active');
        }
    }

    // Move Left/ Prev

    function kalimaPrev() {

        $('.slide:not(.active)').show();
        var currentSlide = $('.slide.active');
        var prevSlide = currentSlide.prev();
        currentSlide.fadeOut(1000).removeClass('active');
        prevSlide.fadeIn().addClass('active');

        if (prevSlide.length == 0) {
            $('.slide').last().show().addClass('active');
        }

    };

    // Move Right / Next

    function kalimaNext() {

        var currentSlide = $('.slide.active');
        var nextSlide = currentSlide.next();
        currentSlide.fadeOut(1000).removeClass('active');
        nextSlide.fadeIn().addClass('active');

        $('.slide:not(.active)').show();

        if (nextSlide.length == 0) {
            $('.slide').first().fadeIn().addClass('active');
        }
    };


});
