//v2222222222222222
// Initialize zoho js API
ZOHO.CREATOR.init()
  .then(function (data) {

    // Get Records from ZOho Creator
    const getRecords = async () => {
      const searchModels = ["Backend_Work_Orders", "All_Job_Cards", "Item_DC1", "Backend_Search_Results"];
      var initparams = ZOHO.CREATOR.UTIL.getInitParams();
      // Fetch all records from Form 1

      var sourceRecords = await ZOHO.CREATOR.API.getAllRecords({
        appName: "zubcon-backup-j25",
        reportName: "All_Users",
        criteria: '(Email = "' + initparams.loginUser + '" && User_Status == "Active" && Log_in_out == "Logged In")'
      });

      console.log(sourceRecords);

      try {
        const promises = searchModels.map(async (model) => {
          try {
            const config = {
              appName: "zubcon-backup-j25",
              reportName: model,
            };

            const records = (model !== "Backend_Search_Results")
              ? await ZOHO.CREATOR.API.getAllRecords({
                appName: "zubcon-backup-j25",
                reportName: model,
                criteria: '(Organization_id=' + sourceRecords.data[0].Organization_ID.ID + ')'
              })
              : await ZOHO.CREATOR.API.getAllRecords(config);

            return { [model]: records.data };
          } catch (error) {
            return { [model]: [{ "error": JSON.parse(error.responseText).message, "Name": model }] };
          }
        });

        const results = await Promise.all(promises);

        // Merge all results into a single object
        const res = Object.assign({}, ...results);
        return res;
      } catch (error) {
        console.error('Critical Error:', error);
      }
    }


    const myFunction = async (url) => {
      config = {
        action: "open",
        url: "https://creatorapp.zoho.in/app_zubcon/zubcon-backup-j25/#Form:" + url + "?zc_LoadIn=dialog",
        window: "same"
      }

      await ZOHO.CREATOR.UTIL.navigateParentURL(config);
      initializeSearch();
    }

    const parama = async (url) => {
      config = {
        action: "open",
        url: "https://creatorapp.zoho.in/app_zubcon/zubcon-backup-j25/#Report:" + url + "?zc_LoadIn=dialog",
        window: "same"
      }

      await ZOHO.CREATOR.UTIL.navigateParentURL(config);
      initializeSearch();
    }

    // Append Item list in the UI
    const appendItems = (all_items) => {

      const list = document.querySelector(".list");
      list.innerHTML = ""; // Clear existing items

      // Create separate containers for each category
      const createNewContainer = document.createElement('div');
      const viewUpdateContainer = document.createElement('div');
      const idsContainer = document.createElement('div')
      if (all_items.length == 0) {
        idsContainer.innerHTML = "No - Data";
        list.appendChild(idsContainer);
        return
      }
      // Add headers for each section
      createNewContainer.innerHTML = "<h6>Create New</h6>";
      viewUpdateContainer.innerHTML = "<h6>View | Update</h6>";
      idsContainer.innerHTML = "<h6> Documents </h6>";

      for (let i = 0; i < all_items.length; i++) {
        const divWrapper = document.createElement('div'); // Create a div wrapper for each button or error message
        divWrapper.classList.add('button-wrapper'); // Add a class to the wrapper

        if (all_items[i].error) {
          // Create and display an error message
          const errorMessage = document.createElement('p');
          errorMessage.textContent = all_items[i].Name + " - " + all_items[i].error;
          errorMessage.classList.add('error-message'); // Add a class for styling
          divWrapper.appendChild(errorMessage);
          idsContainer.appendChild(divWrapper); // Append the error message to the "Documents" section
        } else {
          // Create and display a button
          const button = document.createElement('button');
          button.textContent = all_items[i].Name;
          button.classList.add('custom-button'); // Add a custom button class for styling

          // Add event listeners based on Type_field
          if (all_items[i].Type_field === "Create New") {
            createNewContainer.appendChild(divWrapper);
            button.addEventListener('click', () => myFunction(all_items[i].Link_Name));
          } else if (all_items[i].Type_field === "View | Update") {
            viewUpdateContainer.appendChild(divWrapper);
            button.addEventListener('click', () => parama(all_items[i].Link_Name));
          } else {
            button.textContent = all_items[i].modelName + " - " + all_items[i].Name;
            idsContainer.appendChild(divWrapper);
            button.addEventListener('click', () => parama(all_items[i].Link_Name));
          }

          divWrapper.appendChild(button); // Append the button to the wrapper
        }
      }

      // Append both containers to the main list
      list.appendChild(createNewContainer);
      list.appendChild(viewUpdateContainer);
      list.appendChild(idsContainer);
    }

    document.addEventListener("DOMContentLoaded", async () => {
      const nameArr = await getRecords();
      const resultArray = []
      Object.keys(nameArr).forEach(key => {
        nameArr[key].forEach(arr => {
          if (arr.fl_dc_no_ref?.toLowerCase().includes(val.toLowerCase()) || false) {
            arr["modelName"] = key;
            arr["Name"] = arr?.fl_dc_no_ref || arr.error;
            arr["Link_Name"] = "Back_End_Part_DC?fl_dc_no_ref=" + arr.fl_dc_no_ref;
            resultArray.push(arr);
          } else if (arr.fl_job_card_no?.toLowerCase().includes(val.toLowerCase()) || false) {
            arr["modelName"] = key;
            arr["Name"] = arr.fl_job_card_no || arr.error;
            arr["Link_Name"] = "All_Job_Cards?fl_job_card_no=" + arr.fl_job_card_no;
            resultArray.push(arr);
          } else if (arr.fl_work_order_no?.toLowerCase().includes(val.toLowerCase()) || false) {
            arr["modelName"] = key;
            arr["Name"] = arr.fl_work_order_no || arr.error;
            arr["Link_Name"] = "Backend_Work_Orders?fl_work_order_no=" + arr.fl_work_order_no;
            resultArray.push(arr);
          } else if (arr.Name?.toLowerCase().includes(val.toLowerCase()) || false) {
            resultArray.push(arr);
          } else if (arr.error || false) {
            resultArray.push(arr);
          }
        });
      });
      appendItems(resultArray);
    });



    // Input Actions
    const initializeSearch = () => {
    document.querySelector("#search").addEventListener("input", async (event) => {
      const val = event.target.value;
      const list = document.querySelector(".list");
      if (val) {
        list.classList.remove("d-none");
      }
      else {
        list.classList.add("d-none");
      }
      const nameArr = await getRecords();
      const resultArray = []
      Object.keys(nameArr).forEach(key => {
        nameArr[key].forEach(arr => {
          if (arr.fl_dc_no_ref?.toLowerCase().includes(val.toLowerCase()) || false) {
            arr["modelName"] = key;
            arr["Name"] = arr.fl_dc_no_ref || arr.error;
            arr["Link_Name"] = "Back_End_Part_DC?fl_dc_no_ref=" + arr.fl_dc_no_ref;
            resultArray.push(arr);
          } else if (arr.fl_job_card_no?.toLowerCase().includes(val.toLowerCase()) || false) {
            arr["modelName"] = key;
            arr["Name"] = arr.fl_job_card_no || arr.error;
            arr["Link_Name"] = "All_Job_Cards?fl_job_card_no=" + arr.fl_job_card_no;
            resultArray.push(arr);
          } else if (arr.fl_work_order_no?.toLowerCase().includes(val.toLowerCase()) || false) {
            arr["modelName"] = key;
            arr["Name"] = arr.fl_work_order_no || arr.error;
            arr["Link_Name"] = "Backend_Work_Orders?fl_work_order_no=" + arr.fl_work_order_no;
            resultArray.push(arr);
          } else if (arr.Name?.toLowerCase().includes(val.toLowerCase()) || false) {
            resultArray.push(arr);
          } else if (arr.error || false) {
            resultArray.push(arr);
          }
        });
      });
      appendItems(resultArray);
    });
  }
  initializeSearch();
  });
