// Event listener for dropdown selection
document.getElementById('options').addEventListener('change', function() {
    var mainForm = document.getElementById('mainForm');
    var cancelForm = document.getElementById('cancelForm');
    var tallysyncForm = document.getElementById('tallysyncForm');
    var authorizationQueryForm = document.getElementById('authorizationQueryForm');

    // Show or hide forms based on selected option
    if (this.value === 'cancel_stock_transfer') {
        mainForm.style.display = 'none';
        tallysyncForm.style.display = 'none';
        authorizationQueryForm.style.display = 'none';
        cancelForm.style.display = 'block';
    } else if (this.value === 'tallysync') {
        mainForm.style.display = 'none';
        cancelForm.style.display = 'none';
        authorizationQueryForm.style.display = 'none';
        tallysyncForm.style.display = 'block';
    } else if (this.value === 'authorization_query') {
        mainForm.style.display = 'none';
        cancelForm.style.display = 'none';
        tallysyncForm.style.display = 'none';
        authorizationQueryForm.style.display = 'block';
    } else {
        mainForm.style.display = 'block';
        cancelForm.style.display = 'none';
        tallysyncForm.style.display = 'none';
        authorizationQueryForm.style.display = 'none';
    }
});

// Event listener for generating SQL query for Cancel Production and Stock Transfer
document.getElementById('generateCancelQueryButton').addEventListener('click', function() {
    var transactionType = document.getElementById('transactionType').value;
    var transactionNo = document.getElementById('transactionNo').value;
    var transactionDate = document.getElementById('transactionDate').value;
    var queryOutput = document.getElementById('queryOutput');
    var queryText = document.getElementById('queryText');
    
    // Generate SQL query based on transaction type
    if (transactionType === 'production') {
        queryText.textContent = `SELECT * FROM fun_cancellproduction((SELECT productionid from prod_productionmaster where productionno='${transactionNo}' and productiondate='${transactionDate}' AND branchid=7),'erpadmin');`;
    } else if (transactionType === 'stock') {
        queryText.textContent = `SELECT * FROM fun_cancelstockjournal_2((select adjustmentid from stor_stockadjustmentortransfer where adjustmentno = '${transactionNo}' and adjustmentdate = '${transactionDate}'),'erpadmin');`;
    }

    // Show the generated query
    queryOutput.style.display = 'block';
});

// Event listener for Single Transaction button in Tallysync
document.getElementById('singleTransactionButton').addEventListener('click', function() {
    document.getElementById('singleTransactionForm').style.display = 'block';
    document.getElementById('multipleTransactionForm').style.display = 'none';
});

// Event listener for Multiple Transactions button in Tallysync
document.getElementById('multipleTransactionButton').addEventListener('click', function() {
    document.getElementById('multipleTransactionForm').style.display = 'block';
    document.getElementById('singleTransactionForm').style.display = 'none';
});

// Event listener for generating SQL query for Single Transaction in Tallysync
document.getElementById('generateTallyQueryButton').addEventListener('click', function() {
    var tableName = document.getElementById('tableName').value;
    var transactionNo = document.getElementById('transactionNoTally').value;
    var transactionDate = document.getElementById('transactionDateTally').value;
    var queryOutput = document.getElementById('queryOutput');
    var queryText = document.getElementById('queryText');

    var query = '';
    var currentDateTime = new Date().toLocaleString();

    // Generate SQL query based on table name
    switch (tableName) {
        case 'sale_salesinvoice':
            query = `UPDATE sale_salesinvoice SET issendtotally=False, editlog=COALESCE(editlog,'') ||'tally Sync Reset : Approved on ${currentDateTime}' WHERE invoiceid = (SELECT invoiceid FROM sale_salesinvoice WHERE invoiceno ='${transactionNo}' AND CAST(invoicedate as DATE) = '${transactionDate}');`;
            break;
        case 'pur_purchaseinvoice':
            query = `UPDATE pur_purchaseinvoice SET issendtotally=False, editlog=COALESCE(editlog,'') ||'tally Sync Reset : Approved on ${currentDateTime}' WHERE invoiceid = (SELECT invoiceid FROM pur_purchaseinvoice WHERE invoiceno ='${transactionNo}' AND CAST(invoicedate as DATE) = '${transactionDate}');`;
            break;
        case 'pur_purchaseorder':
            query = `UPDATE pur_purchaseorder SET issendtotally=False, editlog=COALESCE(editlog,'') ||'tally Sync Reset : Approved on ${currentDateTime}' WHERE poid = (SELECT poid FROM pur_purchaseorder WHERE ponumber ='${transactionNo}' AND CAST(podate as DATE) = '${transactionDate}');`;
            break;
        case 'sale_salesorder':
            query = `UPDATE sale_salesorder SET issendtotally=False, editlog=COALESCE(editlog,'') ||'tally Sync Reset : Approved on ${currentDateTime}' WHERE soid = (SELECT soid FROM sale_salesorder WHERE sono ='${transactionNo}' AND CAST(sodate as DATE) = '${transactionDate}');`;
            break;
    }

    // Show the generated query
    queryText.textContent = query;
    queryOutput.style.display = 'block';
});

// Event listener for generating SQL query for Multiple Transactions in Tallysync
document.getElementById('generateMultipleTallyQueryButton').addEventListener('click', function() {
    var tableName = document.getElementById('tableNameMultiple').value;
    var transactionNos = document.getElementById('transactionNos').value.split(',');
    var queryOutput = document.getElementById('queryOutput');
    var queryText = document.getElementById('queryText');

    var query = '';
    var currentDateTime = new Date().toLocaleString();

    // Generate SQL query based on table name
    switch (tableName) {
        case 'sale_salesinvoice':
            query = `UPDATE sale_salesinvoice SET issendtotally=False, editlog=COALESCE(editlog,'') ||'tally Sync Reset : Approved on ${currentDateTime}' WHERE invoiceno IN (${transactionNos.map(no => `'${no.trim()}'`).join(', ')});`;
            break;
        case 'pur_purchaseinvoice':
            query = `UPDATE pur_purchaseinvoice SET issendtotally=False, editlog=COALESCE(editlog,'') ||'tally Sync Reset : Approved on ${currentDateTime}' WHERE invoiceno IN (${transactionNos.map(no => `'${no.trim()}'`).join(', ')});`;
            break;
        case 'pur_purchaseorder':
            query = `UPDATE pur_purchaseorder SET issendtotally=False, editlog=COALESCE(editlog,'') ||'tally Sync Reset : Approved on ${currentDateTime}' WHERE ponumber IN (${transactionNos.map(no => `'${no.trim()}'`).join(', ')});`;
            break;
        case 'sale_salesorder':
            query = `UPDATE sale_salesorder SET issendtotally=False, editlog=COALESCE(editlog,'') ||'tally Sync Reset : Approved on ${currentDateTime}' WHERE sono IN (${transactionNos.map(no => `'${no.trim()}'`).join(', ')});`;
            break;
    }

    // Show the generated query
    queryText.textContent = query;
    queryOutput.style.display = 'block';
});

// Event listener for generating SQL query for Authorization Query
document.getElementById('generateAuthQueryButton').addEventListener('click', function() {
    var tableName = document.getElementById('authQueryTable').value;
    var transactionNo = document.getElementById('authQueryNo').value;
    var transactionDate = document.getElementById('authQueryDate').value;
    var queryOutput = document.getElementById('queryOutput');
    var queryText = document.getElementById('queryText');

    var query = '';
    var currentDateTime = new Date().toLocaleString();

    // Generate SQL query based on table name
    switch (tableName) {
        case 'sale_salesinvoice':
            query = `UPDATE sale_salesinvoice SET authorizedby=NULL, isauthorized=FALSE, editlog=COALESCE(editlog,'') ||'unauthorized : Approved on ${currentDateTime}' WHERE invoiceid = (SELECT invoiceid FROM sale_salesinvoice WHERE invoiceno ='${transactionNo}' AND CAST(invoicedate as DATE) = '${transactionDate}');`;
            break;
        case 'pur_purchaseinvoice':
            query = `UPDATE pur_purchaseinvoice SET authorizedby=NULL, isauthorized=FALSE, editlog=COALESCE(editlog,'') ||'unauthorized : Approved on ${currentDateTime}' WHERE invoiceid = (SELECT invoiceid FROM pur_purchaseinvoice WHERE invoiceno ='${transactionNo}' AND CAST(invoicedate as DATE) = '${transactionDate}');`;
            break;
        case 'pur_purchaseorder':
            query = `UPDATE pur_purchaseorder SET authorizedby=NULL, isauthorized=FALSE, editlog=COALESCE(editlog,'') ||'unauthorized : Approved on ${currentDateTime}' WHERE poid = (SELECT poid FROM pur_purchaseorder WHERE ponumber ='${transactionNo}' AND CAST(podate as DATE) = '${transactionDate}');`;
            break;
        case 'sale_salesorder':
            query = `UPDATE sale_salesorder SET authorizedby=NULL, isauthorized=FALSE, editlog=COALESCE(editlog,'') ||'unauthorized : Approved on ${currentDateTime}' WHERE soid = (SELECT soid FROM sale_salesorder WHERE sono ='${transactionNo}' AND CAST(sodate as DATE) = '${transactionDate}');`;
            break;
        case 'pur_inwardchallan':
            query = `UPDATE pur_inwardchallan SET authorizedby=NULL, isauthorized=FALSE, editlog=COALESCE(editlog,'') ||'unauthorized : Approved on ${currentDateTime}' WHERE inwardchallanid = (SELECT inwardchallanid FROM pur_inwardchallan WHERE inwardchallanno ='${transactionNo}' AND CAST(inwardchallandate as DATE) = '${transactionDate}');`;
            break;
        case 'sale_deliverynote':
            query = `UPDATE sale_deliverynote SET authorizedby=NULL, isauthorized=FALSE, editlog=COALESCE(editlog,'') ||'unauthorized : Approved on ${currentDateTime}' WHERE deliverynoteid = (SELECT deliverynoteid FROM sale_deliverynote WHERE deliverynoteno ='${transactionNo}' AND CAST(deliverynotedate as DATE) = '${transactionDate}');`;
            break;
    }

    // Show the generated query
    queryText.textContent = query;
    queryOutput.style.display = 'block';
});
