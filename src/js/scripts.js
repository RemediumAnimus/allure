$(document).ready(function() {
    var slides = [];
    var pops;

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
                imgUrl = $container.find('img').prop('src'),
                upperUrl = $container.find('.n-upper').prop('src');
            $container.find('img').hide();
            $container.append('<div class="upper-cont"></div>');

            if (imgUrl) {
                $container
                    .css('backgroundImage', 'url(' + imgUrl + ')')
                    .addClass('compat-object-fit');
            }

            if (upperUrl) {
                $container.find('.upper-cont').css('backgroundImage', 'url(' + upperUrl + ')');
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
        console.log($head);
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
                    for (var j=0; j<swiper.wrapper[0].getElementsByClassName('n-effect').length; j++) {
                        swiper.wrapper[0].getElementsByClassName('n-effect')[j].innerHTML = "";
                        swiper.wrapper[0].getElementsByClassName('n-effect')[j].classList.remove('parsed');
                    }
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
            $('.js-menu').animate({'left': 0},0);
        } else {
            $('.js-menu').removeClass('.js-menu--active');
            $('.js-menu').animate({'left': $('.js-menu').outerWidth() * -1},0);
        }
    });

    $('.one-of-js input').click(function(){
        $(this).closest('.one-of-parent-js').find('.one-of-js input').prop('checked',false);
        $(this).prop('checked',true);
    });
    
    //слайдеры в карточке и попапе
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
    }

    function runSlider() {

        if ($('.popSlider').length) {
            $('.popSlider').each(function(index){
                var popSlider = new Swiper($(this)[0], {
                    speed: 600,
                    spaceBetween: 0,
                    effect: 'fade',
                    //loop: true,
                    runCallbacksOnInit: false,
                    speed: 700,
                    coverflow: {
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows : true
                    },
                });
                console.log(popSlider);
                slides.push(popSlider);
            });

            $('.popSliderThumb').each(function(index) {
                var popGallery = new Swiper($(this)[0], {
                    spaceBetween: 0,
                    centeredSlides: true,
                    slidesPerView: 3,
                    speed: 700,
                    touchRatio: 0.2,
                    slideToClickedSlide: true,
                    direction: 'vertical',
                    roundLengths: true,
                });
                slides[index].params.control = popGallery;
                popGallery.params.control = slides[index];
                slides.push(popGallery);
            })
        }


        if ($('#popS').length) {
            popS = new Swiper('#popS', {
                speed: 600,
                spaceBetween: 60,
                effect: 'slide',
                loop: true,
                runCallbacksOnInit: false,
                speed: 700,
                nextButton: '.n-pop__cart__arrR',
                prevButton: '.n-pop__cart__arrL',
                simulateTouch:false
            });
        }

        $('.one-of-js input').click(function(){
            $(this).closest('.one-of-parent-js').find('.one-of-js input').prop('checked',false);
            $(this).prop('checked',true);
        });

        $('.tabs').each(function(index){
            $(this).find('li').click(function(){
                var target = $(this).data('tab');
                $('.tabs-content').find('div').removeClass('active');
                $(this).closest('.n-detail__tabs').find(target).addClass('active');
            })
        })
    }

    //слайдер в деталке
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

    //добавление в корзину
    $('.to-bucket').click(function(){
        var $container = $(this).parent(),
            name = $container.find('.n-typeHead span').html(),
            size = $container.find('.n-detail__checks').find('input:checked').next().find('span').html(),
            cost = $container.find('.n-detail__cost').html(),
            count = $container.find('.n-detail__val').find('input').val();

        var template = ''+
            '<div class="n-order__item">'+
								'<div class="n-order__item__pic">'+
									'<div class="n-order__item__number">'+
										'<span>'+count+'</span>'+
									'</div>'+
									'<img src="img/tmp/prev.png" alt="">'+
								'</div>'+
								'<div class="n-order__item__wrap">'+
									'<div class="n-order__item__cont">'+
										'<div class="n-order__item__header">'+
											name +
										'</div>'+
									'</div>'+
									'<div class="n-order__item__size">'+
										'Размер: ' + size +
									'</div>'+
									'<div class="n-order__item__cost">'+
										cost+
									'</div>'+
									'<div class="n-order__item__del"></div>'+
								'</div>'+
            '</div>'

        if (name && size && cost && count)  {
           $('.n-header__bucket__pop').find('.n-order__items').append(
              template
           );
            bucketCount($('.n-header__bucket').find('.n-order__item').length);
        }

    });

    //колличество товаров в корзине
    function bucketCount(value) {
        $('.n-header__bucket').find('b').html('( '+value+' )');

        //удаление из корзины
        $('.n-order__item__del').click(function(){
            $(this).closest('.n-order__item').remove();
            bucketCount($('.n-header__bucket').find('.n-order__item').length);
        })
    };

    bucketCount($('.n-header__bucket').find('.n-order__item').length);

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

    //скрытие пласехолдера
    function placeholder() {

      $('input[type="text"],input[type="search"] textarea').focus(function(){
        if ($(this).prop('readonly')==false) {
           var plac = $(this).prop('placeholder');
           $(this).prop('placeholder',' ');

           $('input[type="text"],input[type="search"], textarea').blur(function(){
               $(this).prop('placeholder',plac);
           });
        }
      });
    };

    $('.one-of input[type="radio"]').click(function(){
         $(this).parent().parent().parent().parent().find('.one-of input').prop('checked',false);
         $(this).prop('checked',true);
         $('.n-field').find('input[type="text"]').prop('disabled',true).val('');
     });

    //всплывающие окна
    $('.n-catalog__list__item__eye').click(function(e){
        e.preventDefault();
        $('.n-header').addClass('n-header--size');
        $.magnificPopup.open({
            items: {
                src: '#n-pop__cart'
            },
            type: 'inline',

            fixedContentPos: true,
            fixedBgPos: true,

            overflowY: 'auto',
            closeOnBgClick: true,
            closeBtnInside: true,
            preloader: false,
            closeMarkup: '',
            midClick: true,
            removalDelay: 300,
            mainClass: 'my-mfp-slide-bottom',
            callbacks: {
                open: function() {
                    $('.n-header').css('z-index',9999);
                    $('.n-pop__close').show().animate({
                        'opacity':1
                    },'slow');
                    $('.mfp-content').css('height','100%');
                    $('.mfp-bg').css('opacity',0);
                    $('.mfp-bg').animate({
                        'opacity': 0.5
                    },'fast');
                    runSlider();
                    for (var i=0; i<slides.length; i++) {
                        slides[i].onResize();
                        console.log(slides.length);
                    }
                },
                close: function(){
                    popS.destroy();
                    slides = [];
                    $('.n-header').css('z-index',100);
                }
            }
        });
    });
    
    if ($('#n-pop__thanks').length) {
        $.magnificPopup.open({
            items: {
                src: '#n-pop__thanks'
            },
            type: 'inline',

            fixedContentPos: true,
            fixedBgPos: true,

            overflowY: 'auto',
            closeOnBgClick: true,
            closeBtnInside: true,
            preloader: false,
            closeMarkup: '',
            midClick: true,
            removalDelay: 300,
            mainClass: 'my-mfp-slide-bottom',
            callbacks: {
                open: function() {
                    $('.mfp-bg').hide();
                },
                close: function(){

                }
            }
        });
    }

    $('.n-pop__close').click(function(){
        $.magnificPopup.close();
        $('.mfp-bg').animate({
            'opacity': 0
        },'fast');
        $(this).animate({
            'opacity':0
        },'slow',function(){
            $(this).hide();
        });
        $('.n-header').removeClass('n-header--size');
    });

    $('.n-pop__thanks__close').click(function(){
        $.magnificPopup.close();
    })

    //проверка формы
    function formCheck($btn, $that) {
        // Объявляем переменные (форма и кнопка отправки)
        var form = $that,
            btn = $btn;

        // Добавляем каждому проверяемому полю, указание что поле пустое
        form.find('.rfield').addClass('empty_field');

        // Функция проверки полей формы
        function checkInput(){
            form.find('.rfield').each(function(){
                if($(this).val() != ''){// Если поле не пустое удаляем класс-указание
                    $(this).removeClass('empty_field');
                } else {// Если поле пустое добавляем класс-указание
                    $(this).addClass('empty_field');
                }
            });
        }

      // Функция подсветки незаполненных полей
      function lightEmpty(){
          form.find('.empty_field').css({'border-bottom':'1px solid #c56464'});
          form.find('.empty_field').next().show();
          // Через полсекунды удаляем подсветку

          setTimeout(function(){
              form.find('.empty_field').removeAttr('style');
              $('.field-war').hide();
          },500);
      }

        // Проверка в режиме реального времени
        setInterval(function(){
            // Запускаем функцию проверки полей на заполненность
           checkInput();
            // Считаем к-во незаполненных полей
           var sizeEmpty = form.find('.empty_field').size();
            // Вешаем условие-тригер на кнопку отправки формы
           if(sizeEmpty > 0){
              if(btn.hasClass('disabled')){
                  return false
              } else {
                btn.addClass('disabled')
               }
            } else {
               btn.removeClass('disabled')
              }
         },500);

        // Событие клика по кнопке отправить
         btn.click(function(e){
             e.preventDefault();
             if($(this).hasClass('disabled')){
                  // подсвечиваем незаполненные поля и форму не отправляем, если есть незаполненные поля
                 lightEmpty();
                 return false
             } else {
                 // Все хорошо, все заполнено, отправляем форму
                 //form.submit();
                 if (form.attr('id') == "n-data") {
                     $(this).animate({'opacity':0},'fast', function(){
                         $(this).hide();
                         $('.n-buy').css('display','block').animate({'opacity':1},'fast');
                     });
                     form.animate({'opacity':0},'fast', function(){
                         $(this).hide();
                         $('.n-type2').css('display','block').animate({'opacity':1},'fast');
                     });
                 } else {
                     form.submit();
                 }
             }
         });
    }


    $('#n-data').each(function(){
        formCheck($('.n-data'), $(this));
    });
    $('#n-buy').each(function(){
        formCheck($('.n-buy'), $(this));
    });
    $('#n-settings').each(function(){
        formCheck($('.n-settings'), $(this));
    });

    
    $('#cart').selectmenu({
        appendTo: ".n-option-cart",
        position: { my: "left top+5", at: "left bottom", collision: "none" },
        placeholder: 'Тип карты'
    });

    $('#city').selectmenu({
        appendTo: ".n-option-city",
        position: { my: "left top+5", at: "left bottom", collision: "none" },
    });

    $('#country').selectmenu({
        appendTo: ".n-option-country",
        position: { my: "left top+5", at: "left bottom", collision: "none" },
        placeholder: 'Выберите страну'
    });
    $( document ).tooltip({
        position: {
            my: "right+35 bottom-40",
        }
    });

    placeholder();
    sliderMore();
    tabby.init();
    resetMenu();
    
    $(window).on('resize',resetMenu);
    $(window).on('resize',sliderMore);
});