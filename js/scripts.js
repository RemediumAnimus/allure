$(document).ready(function() {

    //расширение для jqueryUi
    $.widget( 'app.selectmenu', $.ui.selectmenu, {
	    _drawButton: function() {
	        this._super();

	        var selected = this.element
	                .find( '[selected]' )
	                .length,
	            placeholder = this.options.placeholder;

	        if ( !selected && placeholder ) {
	            this.buttonText.text( placeholder );
	        }
	    }
	});
    
    //проверка существования css свойства object-fit
    if ( !Modernizr.objectfit ) {
        $('.n-fit').each(function () {
            var $container = $(this),
            imgUrl = $container.find('img').prop('src');
            $container.find('img').hide();
        if (imgUrl) {
              $container
                .css('backgroundImage', 'url(' + imgUrl + ')')
                .addClass('compat-object-fit');
            }
        });
    }
    
    //мобильный якорь
    function isMobileWidth() {
        return $('#medium-indicator').is(':visible');
    }

    //плагин эффекта для текста в слайдере на главной включает в себя функции(saveText, addEffect, append
    //toggleWords, animateHead, singleWord)
    var delay = 50, //задержка между анимациями
        saveText = (function () {
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
            }

            timer = setTimeout(function(){
                addEffect($container);
                if (counter <= maxLength) {
                    $container.find('.is-hidden').eq(mass[counter]).addClass('is-visible');
                    counter++;
                } else {
                    mass = [];
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

    //карусель на главной
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
                }
                if (i==0) {
                    if (slide == "swiper-slide-next") {
                        var src = swiper.slides[i+2].getAttribute('data-thumb');
                        $('.n-main__slider__arrR').find('img').each(function(index){
                            $(this).attr('src',src);
                        });
                    }
                }

                if (slide == "swiper-slide-prev") {
                    var src = swiper.slides[i].getAttribute('data-thumb');
                    $('.n-main__slider__arrL').find('img').each(function(index){
                        $(this).attr('src',src);
                    });
                }

                if (i==swiper.slides.length-1) {
                    if (slide == "swiper-slide-prev") {
                        var src = swiper.slides[i-2].getAttribute('data-thumb');
                        $('.n-main__slider__arrL').find('img').each(function(index){
                            $(this).attr('src',src);
                        });
                    }
                }
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

    function resetMenu() {
       if (isMobileWidth()) {
           $('.js-menu').css({'left': $('.js-menu').outerWidth() * -1});
       }
    };

    $('.n-header__burger').click(function(){
        $(this).toggleClass('active');
        if (!$('.js-menu').hasClass('.js-menu--active')) {
            $('.js-menu').addClass('.js-menu--active');
            $('.js-menu').animate({'left': 0},300);
        } else {
            $('.js-menu').removeClass('.js-menu--active');
            $('.js-menu').animate({'left': $('.js-menu').outerWidth() * -1},300);
        }
    });

    $('.one-of-js input').click(function(){
        $(this).closest('.one-of-parent-js').find('.one-of-js input').prop('checked',false);
        $(this).prop('checked',true);
    });

    if ($('#jsslider').length) {

        var jsSlider = new Swiper('#jsslider', {
            speed: 600,
            spaceBetween: 0,
            effect: 'coverflow',
            //loop: true,
            runCallbacksOnInit: false,
            speed: 700,
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows : true
            }
        });

        var gallery = new Swiper('#jsthumb', {
            spaceBetween: 0,
            centeredSlides: true,
            slidesPerView: 3,
            speed: 700,
            touchRatio: 0.2,
            slideToClickedSlide: true,
            direction: 'vertical',
            roundLengths: true,
        });

        jsSlider.params.control = gallery;
        gallery.params.control = jsSlider;
        jsSlider.slideNext();

    }

    if ($('#n-sliderMore').length) {

        var jsSlider = new Swiper('#n-sliderMore', {
            speed: 600,
            spaceBetween: 0,
            effect: 'fade',
            fade: {
              crossFade: true
            },
            nextButton: '.n-detail__sliderMore__arrR',
            prevButton: '.n-detail__sliderMore__arrL',
            loop: true,
            pagination: '.n-detail__sliderMore__pag',
            paginationClickable: true,
            runCallbacksOnInit: false,
            speed: 700,
            slidesPerView: 1,
            onInit: function(swiper){
               $('.n-detail__sliderMore__pag').find('span').each(function(index){
                   if (index < 9) {
                       $(this).text('0' + (index + 1));
                   }
               });
            },
            onPaginationRendered: function() {
                $('.n-detail__sliderMore__pag').find('span').each(function(index){
                   if (index < 9) {
                       $(this).text('0' + (index + 1));
                   }
               });
            }
        });

    }

    function sliderMore(){
        if ($('#n-sliderMore').length && isMobileWidth()) {
            $('#n-sliderMore').find('.n-detail__sliderMore__slide').each(function(index){
                $('#n-sliderMore').find('.n-detail__sliderMore__slide').eq(index).find('.n-catalog__list__item').eq(2).hide();
            })
        } else {
            $('#n-sliderMore').find('.n-detail__sliderMore__slide').each(function(index){
                $('#n-sliderMore').find('.n-detail__sliderMore__slide').eq(index).find('.n-catalog__list__item').eq(2).show();
            })
        }
    };

    function placeholder() {

      $('input[type="text"],input[type="search"], textarea').focus(function(){
        if ($(this).prop('readonly')==false) {
           var plac = $(this).prop('placeholder');
           $(this).prop('placeholder',' ');

           $('input[type="text"],input[type="search"], textarea').blur(function(){
               $(this).prop('placeholder',plac);
           });
        }
      });
    };
    
    $('#cart').selectmenu({
        appendTo: ".n-option-cart",
        position: { my: "left top+5", at: "left bottom", collision: "none" },
        placeholder: 'Тип карты'
    });

    $('#city').selectmenu({
        appendTo: ".n-option-city",
        position: { my: "left top+5", at: "left bottom", collision: "none" },
    });

    placeholder();
    sliderMore();
    tabby.init();
    resetMenu();
    
    $(window).on('resize',resetMenu);
    $(window).on('resize',sliderMore);
});