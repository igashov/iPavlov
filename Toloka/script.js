// Input sentence
var input = 'At the age of 18, he married Anne Hathaway, with whom he had three children: Susanna and twins Hamnet and Judith';
var words = input.split(' ');
// Categories
var classes = ['Name', 'Age', 'Address', 'Phone'];
// Bio tags
var bio = []
for (var i = 0; i < words.length; i++) {
	bio.push('O');
};
// Current chosen class
var current = classes[0];
// Result: sentence with BIO tags

var categories = $('.categories');
for (var i = 0; i < classes.length; i++) {
	categories.append(
		$('<button/>', {
			text: classes[i],
          		id: '1_' + i,
          		class: (i == 0 ? ('category', 'category_click'): 'category'),
          		click: function () {
            			// Change class
            			previous.removeClass('category_click');
            			$(this).addClass('category_click');
           			// Change current and previous
            			current = $(this).text();
            			previous = $(this);
        		},
        	})
	);
};

// Class chosen before the current class 
// (initially it's the first class) 
var previous = $('#1_0');

// Returns sets from 'S' that intersect with 'h'
function intersections(S, h) {
	var inters = new Set(); 
	S.forEach(function(s) {
		var intersection = new Set([...s].filter(x => h.has(x)));
		if (intersection.size > 0) {
			inters.add(s);
		};
	});
	return inters;
};

// Set holding all current highlights
var S = new Set();
// Begin and end of current highlight
var begin = 0;
var end = 0;

var sentence = $('.sentence');
for (var i = 0; i < words.length; i++) {
	sentence.append(
      		$('<span/>', {
        		text: words[i] + ' ',
         		id: '2_' + i,
          		class: 'word',
          		mousedown: function () {
				var id = parseInt(this.id.split('_')[1]);
				begin = id;
			},
			mouseup: function () {
				// Remove selection effect
				if (window.getSelection) {
  					if (window.getSelection().empty) {  // Chrome
   						window.getSelection().empty();
  					} else if (window.getSelection().removeAllRanges) {  // Firefox
    						window.getSelection().removeAllRanges();
  					}
				} else if (document.selection) {  // IE?
  					document.selection.empty();
				}

				// Get first and last indexes
				var id = parseInt(this.id.split('_')[1]);
				end = id;
				if (begin > end) {
					var tmp = begin;
					begin = end;
					end = tmp;
				};

				// Create highlighting object
				var highlighting = new Set();
				for (var i = begin; i <= end; i++) {
					highlighting.add(i);
				};

				// Check intersections
				var inters = intersections(S, highlighting);
				if (inters.size == 0) {  
					//-- No intersections --//
					S.add(highlighting);
					highlighting.forEach(function(i) {
						// add Class 'word_h'
						var element = $('#2_' + i);
						element.addClass('word_h');
						// reset BIO
						bio[i] = current;
					});
					// Add special classes to first and last words in highlight 
					// (for border highlight correctly)
					$('#2_' + begin).addClass('word_left');
					$('#2_' + end).addClass('word_right');
				} else {  
					//-- Found intersections --//
					inters.forEach(function(h) {
						h.forEach(function(i) {
							// remove additional classes
							var element = $('#2_' + i);
							element.removeClass('word_h');
							element.removeClass('word_left');
							element.removeClass('word_right');
							// reset BIO
							bio[i] = 'O';
						});
						S.delete(h);
					});
				}
			}

		})
	);
};
    
var doneBtn = $('.done');
doneBtn.text('DONE');
doneBtn.click(function() {
	var result = '';
	for (var i = 0; i < words.length; i++) {
          	result += words[i] + ' ' + bio[i] + '\n';
        };
	alert(result);
});
