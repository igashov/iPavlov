exports.Task = extend(TolokaHandlebarsTask, function (options) {
  TolokaHandlebarsTask.call(this, options);
}, {
  onRender: function() {
    // DOM-элемент задания сформирован (доступен через #getDOMElement())
    
    // Splits sentence into words
    function ParseSentence(s) {
			var words = s.split(' ');
			return words;
		};

		// To lowercase and remove punctuation character (if exists)
		function Normalize(word) {
			word = word.toLowerCase();
			var last_char = word.charAt(word.length - 1);
			return word;
		};

		// Checks if obj already exists in arr
		function Contains(arr, obj) {
			var contains = false;
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] == obj) {
					contains = true;
					break;
				};
			};
			return contains;
		};

    var sentence = 'Светить всегда, светить везде, до дней последних донца; светить — и никаких гвоздей, — вот лозунг мой и солнца!';
    var words = ParseSentence(sentence);
    var words_number = words.length;
    var classes = ['Глагол', 'Существительное', 'Прилагательное', 'Наречие', 'Союз', 'Местоимение', 'Частица', 'Предлог'];
    var classes_num = 8;
    var bio = []
    for (var i = 0; i < words.length; i++) {
      bio.push(-1);
    };
    var current = 0;
    var result = '';
    
    var categories = $(this.getDOMElement()).find('.categories');
    var prev = $(this.getDOMElement()).find('#1.' + current);
    for (var i = 0; i < classes_num; i++) {
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
            current = id;
            prev = $(this);
        },
        }));
    };
    
    var sentence = $(this.getDOMElement()).find('.sentence');
    for (var i = 0; i < words_number; i++) {
      sentence.append(
      	$('<span/>', {
        	text: words[i] + ' ',
          id: '2.' + i,
          class: 'word',
        	click: function () {
            if ($(this).attr('class') == 'word') {
              // style
              $(this).attr('class', 'word_click');
              // action
              var id = parseInt(this.id.split('.')[1]);
              bio[id] = current;
            } else {
              // style
              $(this).attr('class', 'word');
              // action
              var id = parseInt(this.id.split('.')[1]);
              bio[id] = -1;
            };
          },
        	mouseover: function () {
            // style
            this.style.cursor = 'pointer';
            this.style.color = 'red';
        	},
        	mouseout: function () {
            // style
          	this.style.color = 'black';
        	},
    		}));
    };
    
    var done = $(this.getDOMElement()).find(".done");
    done.append(
      $('<button/>', {
        text: "ГОТОВО",
        id: '3.0',
        class: 'done',
        click: function () {
          // Create BIO-output
          // http://natural-language understanding.wikia.com/wiki/Named_entity_recognition
          result = '';
          var b = true;
          for (var i = 0; i < words.length; i++) {
            var tag = 'O';
            if (bio[i] != -1) {
              if (i > 0 && bio[i] == bio[i - 1]) {
                b = false;
              } else {
                b = true;
              }
              tag = (b ? 'B-' : 'I-') + classes[bio[i]];
            };
            result += words[i] + ' ' + tag + '\n';
          };
          alert(result);
        },
        mouseover: function () {
        	this.style.backgroundColor = 'Yellow';
      	},
        mouseout: function () {
        	this.style.backgroundColor = "White";
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

