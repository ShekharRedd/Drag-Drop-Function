var undoStack = [];

$(document).ready(function () {
    // Add-Row functionality
    $("#Add-Row").click(function () {
        var lastRow = $('#outside-table tr:last').clone();
        var lastButton = lastRow.find("td:last button");
        var lastId = lastButton.attr("id");
        var lastNumber = parseInt(lastId.match(/\d+/)[0]);

        lastRow.find("button").each(function (index, element) {
            var newNumber = lastNumber + (index + 1) * 100;
            $(this).attr("id", newNumber);
            $(this).css("background-color", "#" + Math.floor(Math.random() * 16777215).toString(16));
            $(this).text(newNumber);
            $(this).attr("draggable", "true"); // Make new button draggable
        });

        $("#outside-table").append(lastRow);

        // Push the row action to the undo stack
        undoStack.push({ type: 'add', row: lastRow });
        showEmoji("👍");  // Show emoji on add
    });

    // Undo-Row functionality
    $("#Undo-Row").click(function () {
        if (undoStack.length > 0) {
            var lastAction = undoStack.pop();

            if (lastAction.type === 'add') {
                lastAction.row.remove();  // Remove the last added row
            } else if (lastAction.type === 'swap') {
                // Revert the swap
                var sourceButton = lastAction.sourceButton;
                var targetButton = lastAction.targetButton;

                sourceButton.innerText = lastAction.sourceText;
                sourceButton.style.backgroundColor = lastAction.sourceColor;

                targetButton.innerText = lastAction.targetText;
                targetButton.style.backgroundColor = lastAction.targetColor;
            }
            showEmoji("😎");  // Show emoji on undo
        }
    });

    // Drag and Drop functionality using event delegation
    let draggedElement = null;

    $(document).on('dragstart', '.button-class', function (event) {
        draggedElement = event.target;
        draggedElement.classList.add('dragging');
    });

    $(document).on('dragend', '.button-class', function (event) {
        draggedElement.classList.remove('dragging');
        draggedElement = null; // Reset draggedElement
    });

    $(document).on('dragover', 'td', function (event) {
        event.preventDefault();
    });

    $(document).on('drop', 'td', function (event) {
        event.preventDefault();
        let sourceButton = draggedElement;
        let targetButton = $(event.target).closest('td').find('button')[0]; // Find the target button

        if (targetButton && targetButton !== sourceButton) {
            // Save current state for undo
            undoStack.push({
                type: 'swap',
                sourceButton: sourceButton,
                targetButton: targetButton,
                sourceText: sourceButton.innerText,
                sourceColor: sourceButton.style.backgroundColor,
                targetText: targetButton.innerText,
                targetColor: targetButton.style.backgroundColor
            });

            // Swap the text and background color of the buttons
            let tempText = sourceButton.innerText;
            let tempColor = sourceButton.style.backgroundColor;

            sourceButton.innerText = targetButton.innerText;
            sourceButton.style.backgroundColor = targetButton.style.backgroundColor;

            targetButton.innerText = tempText;
            targetButton.style.backgroundColor = tempColor;

            showEmoji("🎉");  // Show emoji on drag and drop success
        }
    });

// Function to show emoji for 2 seconds
function showEmoji(emoji) {
    const emojiContainer = $("#emoji-container");
    emojiContainer.text(emoji);

    // Calculate current scroll position
    const scrollTop = $(window).scrollTop();
    const scrollLeft = $(window).scrollLeft();

    // Position the emoji based on scroll position
    emojiContainer.css({
        top: scrollTop + 10 + 'px',  // Adjust '10' for vertical offset if needed
        right: scrollLeft + 100 + 'px' // Adjust '100' for horizontal offset
    });

    emojiContainer.show(); // Show the emoji container

    setTimeout(function () {
        emojiContainer.fadeOut(); // Hide the emoji after 2 seconds
    }, 2000); // Increase duration for better visibility
}


});
