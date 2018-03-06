exports.Task = extend(TolokaHandlebarsTask, function (options) {
  TolokaHandlebarsTask.call(this, options);
}, {
  onRender: function() {
    // DOM-элемент задания сформирован (доступен через #getDOMElement())
		var input = 'Светить всегда, светить везде, до дней последних донца; светить — и никаких гвоздей, — вот лозунг мой и солнца!';
		var words = input.split(' ');
    var classes = ['Глагол', 'Существительное', 'Прилагательное', 'Наречие', 'Союз', 'Местоимение', 'Частица', 'Предлог'];
    var bio = []
    for (var i = 0; i < words.length; i++) {
      bio.push('O');
    };
    var current = classes[0];
    var result = '';
    
    var categories = $(this.getDOMElement()).find('.categories');
    var prev = $(this.getDOMElement()).find('#1.' + current);
    for (var i = 0; i < classes.length; i++) {
      categories.append(
      	$('<button/>', {
        	text: classes[i],
          id: '1.' + i,
          class: 'category',
          click: function () {
            // style
            prev.attr('class', 'category');
            $(this).attr('class', 'category_click');
            // action
            var id = parseInt(this.id.split('.')[1]);
            current = $(this).text();
            prev = $(this);
        },
        }));
    };
   
    var first = 0;
    var last = 0;
    var first_pos = 0;
    var highlighting = false;
    var selected = false;
    var sentence = $(this.getDOMElement()).find('.sentence');
    for (var i = 0; i < words.length; i++) {
      sentence.append(
      	$('<span/>', {
        	text: words[i] + ' ',
          id: '2.' + i,
          class: 'word',
          mousedown: function () {
            if (selected == false) {
              selected = true;
              highlighting = true;
              first_pos = $(this).position().left;
            	first = parseInt(this.id.split('.')[1]);
            	$(this).addClass('word_selected');
            } else {
              selected = false;
              for (var j = first; j <= last; j++) {
                bio[j] = 'O';
                $(this).parent().find('.word_selected').
                removeClass('word_selected');
              };
            };
          },
          mouseup: function () {
            if (selected == true) {
            	var id = parseInt(this.id.split('.')[1]);
            	last = id;
            	highlighting = false;
            	for (var j = first; j <= last; j++) {
              	bio[j] = current;
            	};
            };
          },
          mouseenter: function () {
            if (highlighting == true) {
              $(this).addClass('word_selected');
            };
          },
          mouseleave: function () {
            var word_pos = $(this).position().left
            var mouse_pos = event.pageX
            if (highlighting == true && 
                ((first_pos < word_pos && mouse_pos < word_pos) ||
                (first_pos > word_pos && mouse_pos > word_pos))) {
              $(this).removeClass('word_selected');
            };
          }
    		}));
    };
    
    var done = $(this.getDOMElement()).find(".done");
    done.append(
      $('<button/>', {
        text: "ГОТОВО",
        id: '3.0',
        class: 'done_btn',
        click: function () {
          // Create BIO-output
          result = '';
          for (var i = 0; i < words.length; i++) {
            result += words[i] + ' ' + bio[i] + '\n';
          };
          alert(result);
        },
      }));
  },
  onDestroy: function() {
    // Задание завершено, можно освобождать (если были использованы) глобальные ресурсы
  }
});

function extend(ParentClass, constructorFunction, prototypeHash) {
  constructorFunction = constructorFunction || function () {};
  prototypeHash = prototypeHash || {};
  if (ParentClass) {
    constructorFunction.prototype = Object.create(ParentClass.prototype);
  }
  for (var i in prototypeHash) {
    constructorFunction.prototype[i] = prototypeHash[i];
  }
  return constructorFunction;
}

