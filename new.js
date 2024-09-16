// Event listener for dropdown selection
document.getElementById('options').addEventListener('change', function() {
    var mainForm = document.getElementById('mainForm');
    var cancelForm = document.getElementById('cancelForm');
    var tallysyncForm = document.getElementById('tallysyncForm');
    var authorizationQueryForm = document.getElementById('authorizationQueryForm');
    var cancelUncancelForm = document.getElementById('cancelUncancelForm');
    var dummyUpdateForm = document.getElementById('dummyUpdateForm');

    // Show or hide forms based on selected option
    if (this.value === 'cancel_stock_transfer') {
        mainForm.style.display = 'none';
        tallysyncForm.style.display = 'none';
        authorizationQueryForm.style.display = 'none';
        cancelUncancelForm.style.display = 'none';
        dummyUpdateForm.style.display = 'none';
        cancelForm.style.display = 'block';
    } else if (this.value === 'tallysync') {
        mainForm.style.display = 'none';
        cancelForm.style.display = 'none';
        authorizationQueryForm.style.display = 'none';
        cancelUncancelForm.style.display = 'none';
        dummyUpdateForm.style.display = 'none';
        tallysyncForm.style.display = 'block';
    } else if (this.value ==='authorization_query') { mainForm.style.display = 'none'; cancelForm.style.display = 'none'; tallysyncForm.style.display = 'none'; cancelUncancelForm.style.display = 'none'; dummyUpdateForm.style.display = 'none'; authorizationQueryForm.style.display = 'block'; } else if (this.value === 'cancel_uncancel') { mainForm.style.display = 'none'; cancelForm.style.display = 'none'; tallysyncForm.style.display = 'none'; authorizationQueryForm.style.display = 'none'; dummyUpdateForm.style.display = 'none'; cancelUncancelForm.style.display = 'block'; } else if (this.value === 'dummy_update') { mainForm.style.display = 'none'; cancelForm.style.display = 'none'; tallysyncForm.style.display = 'none'; authorizationQueryForm.style.display = 'none'; cancelUncancelForm.style.display = 'none'; dummyUpdateForm.style.display = 'block'; } });

// Event listener for generating SQL query for Tallysync document.getElementById('generateTallyQueryButton').addEventListener('click', function() { var tableName = document.getElementById('tableName').value; var transactionNo = document.getElementById('transactionNoTally').value; var transactionDate = document.getElementById('transactionDateTally').value; var action = document.getElementById('tallyAction').value; var queryOutput = document.getElementById('queryOutput'); var queryText = document.getElementById('queryText');

var query = '';

// Generate SQL query for Tallysync
if (action === 'set') {
    query = `UPDATE ${tableName} SET issenttotally = TRUE, editlog = COALESCE(editlog, '') || ' Tallysync' WHERE ${tableName}id = (SELECT ${tableName}id FROM ${tableName} WHERE invoiceno ='${transactionNo}' AND CAST(invoicedate as DATE) = '${transactionDate}');`;
} else {
    query = `UPDATE ${tableName} SET issenttotally = FALSE, editlog = COALESCE(editlog, '') || ' Tally Sync Reset' WHERE ${tableName}id = (SELECT ${tableName}id FROM ${tableName} WHERE invoiceno ='${transactionNo}' AND CAST(invoicedate as DATE) = '${transactionDate}');`;
}

// Show the generated query
queryText.textContent = query;
queryOutput.style.display = 'block';

});

// Event listener for generating SQL query for Authorization Query document.getElementById('generateAuthQueryButton').addEventListener('click', function() { var tableName = document.getElementById('authQueryTable').value; var transactionNo = document.getElementById('authQueryNo').value; var transactionDate = document.getElementById('authQueryDate').value; var action = document.getElementById('authAction').value; var queryOutput = document.getElementById('queryOutput'); var queryText = document.getElementById('queryText');

var query = '';

// Generate SQL query for Authorization
if (action === 'authorize') {
    query = `UPDATE ${tableName} SET authorizedby = 1, isauthorized = TRUE, authorizedon = CURRENT_DATE, editlog = COALESCE(editlog, '') || ' Authorization' WHERE ${tableName}id = (SELECT ${tableName}id FROM ${tableName} WHERE invoiceno ='${transactionNo}' AND CAST(invoicedate as DATE) = '${transactionDate}');`;
} else {
    query = `UPDATE ${tableName} SET authorizedby = NULL, isauthorized = FALSE, editlog = COALESCE(editlog, '') || ' Unauthorized' WHERE ${tableName}id = (SELECT ${tableName}id FROM ${tableName} WHERE invoiceno ='${transactionNo}' AND CAST(invoicedate as DATE) = '${transactionDate}');`;
}

// Show the generated query
queryText.textContent = query;
queryOutput.style.display = 'block';

});

// Event listener for generating SQL query for Cancel/Uncancel document.getElementById('generateCancelUncancelQueryButton').addEventListener('click', function() { var tableName = document.getElementById('cancelUncancelTable').value; var transactionNo = document.getElementById('cancelUncancelNo').value; var transactionDate = document.getElementById('cancelUncancelDate').value; var action = document.getElementById('cancelUncancelAction').value; var queryOutput = document.getElementById('queryOutput'); var queryText = document.getElementById('queryText');

var query = '';

// Generate SQL query for Cancel/Uncancel
if (action === 'cancel') {
    query = `UPDATE ${tableName} SET iscancelled = TRUE, cancellationreason = 'Backend Change', cancelledby = 1, cancelledon = CURRENT_DATE, editlog = COALESCE(editlog, '') || ' Cancelled' WHERE ${tableName}id = (SELECT ${tableName}id FROM ${tableName} WHERE invoiceno ='${transactionNo}' AND CAST(invoicedate as DATE) = '${transactionDate}');`;
} else {
    query = `UPDATE ${tableName} SET iscancelled = FALSE, cancellationreason = NULL, cancelledby = NULL, cancelledon = NULL, editlog = COALESCE(editlog, '') || ' Uncancelled' WHERE ${tableName}id = (SELECT ${tableName}id FROM ${tableName} WHERE invoiceno ='${transactionNo}' AND CAST(invoicedate as DATE) = '${transactionDate}');`;
}

// Show the generated query
queryText.textContent = query;
queryOutput.style.display = 'block';

});

// Event listener for generating SQL query for Dummy Update document.getElementById('generateDummyUpdateQueryButton').addEventListener('click', function() { var tableName = document.getElementById('dummyTable').value; var transactionNo = document.getElementById('dummyTransactionNo').value; var transactionDate = document.getElementById('dummyTransactionDate').value; var queryOutput = document.getElementById('queryOutput'); var queryText = document.getElementById('queryText');

var query = '';
var currentDateTime = new Date().toLocaleString();

// Generate SQL query for Dummy Update
query = `UPDATE ${tableName} SET editlog=COALESCE(editlog,'') || ' editlog : Approved on ${currentDateTime}' WHERE ${tableName}id = (SELECT ${tableName}id FROM ${tableName} WHERE invoiceno ='${transactionNo}' AND CAST(invoicedate as DATE) = '${transactionDate}');`;

// Show the generated query
queryText.textContent = query;
queryOutput.style.display = 'block';

});
