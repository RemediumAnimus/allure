$(document).ready(function() {

    var delay = 50;

    var saveText = (function () {
        var tmp;
        return function(text) {
            if (text) {
                tmp = text;
                return tmp;
            } else {
                return tmp;
            }
        }
    })();

    var addEffect = (function () {
        var counter = 0;
        var maxLength = 0;
        var timer;
        var mass = [];
        return function($container) {
            maxLength = $container.find('.is-hidden').length;

            if (!mass.length) {
                for (var i=1; i<=maxLength; i++) {
                    mass.push(i);
                }

                for (var k=1; k<mass.length; k++) {
                    var j = Math.floor(Math.random() * (maxLength));
                    var tmp = mass[k];
                    mass[k] = mass[j];
                    mass[j] = tmp;
                }

                mass.unshift(0);

                console.log(mass);
            }

            timer = setTimeout(function(){
                addEffect($container);
                if (counter <= maxLength) {
                    $container.find('.is-hidden').eq(mass[counter]).addClass('is-visible');
                    counter++;
                } else {
                    mass = [];
                    console.log(counter);
                    counter = 0;
                    maxLength = 0;
                    clearTimeout(timer);
                }
            },delay);

        }
    })();

    function append($container, word) {
        $container.append(word);
    }


    var toggleWords = function(words, $head, $container) {

        for (var i=0; i<words.length; i++) {
            var word = singleWord(words[i]);
            append($container, word);
        }
        addEffect($container);

    };

    function animateHead($head, $container) {
        if (!$container.hasClass('parsed')) {
            var words = $head.trim().split(/\s{0,}(?=\s)/i);
            $container.html('');
            toggleWords(words, $head, $container);
            $container.addClass('parsed');
        } else {
            return;
        }
    }

    function singleWord($word) {
        var word = $word.split('');

        var wordTransform = word.map(function (item) {
            if (item == " ") item = "&nbsp;";
            var tag = '<i class="is-hidden">' + item + '</i>';
            return tag;
        });

        wordTransform.unshift('<span>');
        wordTransform.push('</span>');

        return wordTransform.join('');
      }


    var sliderM = new Swiper('#n-sliderM', {
        speed: 600,
        spaceBetween: 0,
        effect: "fade",
        nextButton: '.n-main__slider__arrR',
        prevButton: '.n-main__slider__arrL',
        loop: true,
        runCallbacksOnInit: false,
        onInit: function(swiper) {
            for (var i=0; i<swiper.slides.length; i++) {
	    		var length = swiper.slides[i].className.split(' ').length;
	    		var slide = swiper.slides[i].className.split(' ')[length-1];

                if (slide == "swiper-slide-active") {
                    var text = swiper.slides[i].getElementsByClassName('n-animH')[0].innerHTML;
                    saveText(text);
                    animateHead(saveText(),$('.n-effect').eq(i));
                }

                if (slide == "swiper-slide-next") {
                    var src = swiper.slides[i].getAttribute('data-thumb');
                    $('.n-main__slider__arrR').find('img').each(function(index){
                        $(this).attr('src',src);
                    });
                }

                if (slide == "swiper-slide-prev") {
                    var src = swiper.slides[i].getAttribute('data-thumb');
                    $('.n-main__slider__arrL').find('img').each(function(index){
                        $(this).attr('src',src);
                    });
                }
	    	}

        },
        onSlideChangeStart: function(swiper) {
            var statusNext = false;
            var statusPrev = false;

            for (var i=0; i<swiper.slides.length; i++) {
	    		var length = swiper.slides[i].className.split(' ').length;
	    		var slide = swiper.slides[i].className.split(' ')[length-1];

                if (slide == "swiper-slide-active") {
                    var text = swiper.slides[i].getElementsByClassName('n-animH')[0].innerHTML;
                    saveText(text);
                }

                if (slide == "swiper-slide-next") {
                    var src = swiper.slides[i].getAttribute('data-thumb');
                    $('.n-main__slider__arrR').find('img').each(function(index){
                        $(this).attr('src',src);
                    });
                    statusNext = true;
                }

                if (slide == "swiper-slide-prev") {
                    var src = swiper.slides[i].getAttribute('data-thumb');
                    $('.n-main__slider__arrL').find('img').each(function(index){
                        $(this).attr('src',src);
                    });
                    statusPrev = true;
                }
	    	}

            if (!statusNext) {

                var src = swiper.slides[2].getAttribute('data-thumb');
                 $('.n-main__slider__arrR').find('img').each(function(index){
                     $(this).attr('src',src);
                 });
                status = false
            }

            if (!statusPrev) {
                var src = swiper.slides[2].getAttribute('data-thumb');
                 $('.n-main__slider__arrL').find('img').each(function(index){
                     $(this).attr('src',src);
                 });
                status = false
            }

        },
        onSlideChangeEnd: function(swiper) {

            for (var i=0; i<swiper.slides.length; i++) {

                var length = swiper.slides[i].className.split(' ').length;
                var slide = swiper.slides[i].className.split(' ')[length - 1];

                if (slide == "swiper-slide-prev") {
                    for (var j=0; j<swiper.wrapper[0].getElementsByClassName('n-effect').length; j++) {
                        swiper.wrapper[0].getElementsByClassName('n-effect')[j].innerHTML = "";
                        swiper.wrapper[0].getElementsByClassName('n-effect')[j].classList.remove('parsed');
                    }
                }

                if (slide == "swiper-slide-active") {
                    animateHead(saveText(),$('.n-effect').eq(i));
                }

            }
        }
    });
});