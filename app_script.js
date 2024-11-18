function doPost(e) {
    try {
      if (!e || !e.postData) {
        Logger.log("No POST data received.");
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "No POST data received"
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Log the received POST data for debugging
      const requestData = JSON.parse(e.postData.contents);
      Logger.log("Request Data: " + JSON.stringify(requestData));
  
      if (requestData.action === "login") {
        const { employeeId, password } = requestData;
        
        // Call the checkCredentials function to verify the login
        const loginResult = checkCredentials(employeeId, password);
        return ContentService.createTextOutput(JSON.stringify(loginResult)).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "Unknown action"
        })).setMimeType(ContentService.MimeType.JSON);
      }
    } catch (error) {
      Logger.log("Error in doPost: " + error.message);
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: error.message
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  function checkCredentials(employeeId, password) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
    
    // Log if the sheet is found
    if (!sheet) {
      Logger.log("Sheet not found: Users");
      return { status: "error", message: "Sheet not found" };
    }
  
    // Get all data from the sheet
    const dataRange = sheet.getDataRange().getValues();
    Logger.log("Fetched data from sheet: " + JSON.stringify(dataRange));
  
    for (let i = 1; i < dataRange.length; i++) {
      const rowData = dataRange[i];
      Logger.log("Row Data (Employee ID): " + rowData[0]);
      Logger.log("Row Data (Password): '" + rowData[7] + "'");
  
      // Check if Employee ID matches
      if (employeeId === rowData[0]) {
        let sheetPassword = rowData[7]; // Password from the sheet
  
        // Log the type and value of the sheetPassword for debugging
        Logger.log("Type of sheetPassword: " + typeof sheetPassword);
        Logger.log("sheetPassword value: '" + sheetPassword + "'");
  
        // Check if sheetPassword is a valid string, otherwise log the value and type for debugging
        if (sheetPassword == null || typeof sheetPassword !== "string") {
          Logger.log("Invalid password format for Employee ID: " + employeeId);
          return { status: "error", message: "Password format is invalid" };
        }
  
        // Trim spaces and make lowercase for case-insensitive comparison
        if (password.trim().toLowerCase() === sheetPassword.trim().toLowerCase()) {
          // Return detailed information about the employee if login is successful
          const userDetails = {
            status: "success",
            message: "Login successful",
            employeeId: rowData[0],
            fullName: rowData[1],
            jobCategory: rowData[2],
            department: rowData[3],
            managerId: rowData[4],
            role: rowData[5],
            accessibleDepartments: rowData[6],
          };
          Logger.log("Login successful for Employee ID: " + employeeId);
          return userDetails; // Returning user details
        } else {
          Logger.log("Incorrect password for Employee ID: " + employeeId);
          return { status: "error", message: "Incorrect password" };
        }
      }
    }
  
    // If Employee ID is not found
    Logger.log("No match found for Employee ID: " + employeeId);
    return { status: "error", message: "Invalid Employee ID" };
  }
  