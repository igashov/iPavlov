exports.Task = extend(TolokaHandlebarsTask, function (options) {
  TolokaHandlebarsTask.call(this, options);
}, {
  onRender: function() {
    // DOM-элемент задания сформирован (доступен через #getDOMElement())
    function ParseSentence(s) {
			var words = s.split(" ");
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

		var sentence = "Светить всегда, светить везде, до дней последних донца; светить — и никаких гвоздей, — вот лозунг мой и солнца!";
		var words = ParseSentence(sentence);
		var words_number = words.length;
    var classes = ["Глагол", "Существительное", "Прилагательное", "Наречие", "Союз", "Местоимение", "Частица", "Предлог"];
    var classes_num = 8;
		var chosen_words = [[], [], [], [], [], [], [], []];
    var current = 0;
    
    var categories = $(this.getDOMElement()).find(".categories");
    var prev = $(this.getDOMElement()).find("#1." + current);
    for (var i = 0; i < classes_num; i++) {
      categories.append(
      	$('<button/>', {
        	text: classes[i],
          id: "1." + i,
          click: function () {
            var id = parseInt(this.id.split(".")[1]);
            prev.css('background-color', 'white');
            current = id;
            prev = $(this);
            this.style.backgroundColor = "yellow";
          },
        }));
    };
    
    var sentence = $(this.getDOMElement()).find(".sentence");
    for (var i = 0; i < words_number; i++) {
      sentence.append(
      	$('<button/>', {
        	text: words[i],
          id: "2." + i,
        	click: function () {
						 var id = parseInt(this.id.split(".")[1]);
						 var word = Normalize(words[id]);
				  	 if (!Contains(chosen_words[current], word)) {
							 chosen_words[current].push(word);
						 };
            this.style.border = 'solid';
            this.style.borderColor = 'green';
            this.style.borderWidth = "1px";
          },
        	mouseover: function () {
         		this.style.color = "red";
        	},
        	mouseout: function () {
          	this.style.color = "black";
        	},
          style: "background-color:transparent;border:none"
    		}));
    };
    
    var done = $(this.getDOMElement()).find(".done");
    done.append(
      $('<button/>', {
        text: "ГОТОВО",
        id: "done",
        click: function () {
          for (var i = 0; i < classes_num; i++) {
            alert(classes[i] + ":" + chosen_words[i])
          };
        },
        mouseover: function () {
        	this.style.backgroundColor = "Yellow";
      	},
        mouseout: function () {
        	this.style.backgroundColor = "White";
      	},
        style: "background-color:transparent;color:green;"
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
