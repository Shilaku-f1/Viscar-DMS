window.onload = function() {
    let employeeId = localStorage.getItem('employeeId');
    let role = localStorage.getItem('role');
    let department = localStorage.getItem('department');

    document.getElementById('user-info').innerText = `Logged in as: ${employeeId} (${role})`;

    // Load documents based on role and department
    loadDocuments(employeeId, role, department);

    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.clear();
        window.location.href = 'login.html'; // Redirect to login page
    });
};

function loadDocuments(employeeId, role, department) {
    google.script.run.withSuccessHandler(function(documents) {
        let documentTable = document.getElementById('documentTable').getElementsByTagName('tbody')[0];
        
        documents.forEach(function(doc) {
            let row = documentTable.insertRow();
            row.insertCell(0).innerText = doc[1]; // Document name (Assumed to be in column 2)
            row.insertCell(1).innerText = doc[2]; // Department (Assumed to be in column 3)
            row.insertCell(2).innerHTML = '<button>View</button>';
        });
    }).getEmployeeDocuments(employeeId, role, department);
}
