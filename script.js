//v333333333333333333333
// Initialize zoho js API
ZOHO.CREATOR.init()
  .then(function (data) {

    // Get Records from ZOho Creator
    const getRecords = async () => {
      const searchModels = ["Backend_Work_Orders", "All_Job_Cards", "Item_DC1", "Backend_Search_Results"];

      try {
        const promises = searchModels.map(async (model) => {
          const records = await ZOHO.CREATOR.API.getAllRecords({
            appName: "zubcon-backup-j25",
            reportName: model
          });
          return { [model]: records.data };
        });

        const results = await Promise.all(promises);

        const res = Object.assign({}, ...results);

        console.log(res);
        return res;
      } catch (error) {
        console.error(error);
      }


    }


    const myFunction = async (url) => {
      config = {
        action: "open",
        url: "https://creatorapp.zoho.in/app_zubcon/zubcon-backup-j25/#Form:" + url,
        window: "same"
      }

      await ZOHO.CREATOR.UTIL.navigateParentURL(config);
    }

    const parama = async (url) => {
      config = {
        action: "open",
        url: "https://creatorapp.zoho.in/app_zubcon/zubcon-backup-j25/#Report:" + url,
        window: "same"
      }

      await ZOHO.CREATOR.UTIL.navigateParentURL(config);
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
      idsContainer.innerHTML = "Ids";

      // Iterate over all items
      for (let i = 0; i < all_items.length; i++) {
        const divWrapper = document.createElement('div'); // Create a div wrapper for each button
        divWrapper.classList.add('button-wrapper'); // Add a class to the wrapper

        const button = document.createElement('button');
        button.textContent = all_items[i].Name;
        // Add a custom button class for styling



        // Append buttons to the appropriate section based on Type_field
        if (all_items[i].Type_field === "Create New") {
          createNewContainer.appendChild(divWrapper);
          button.addEventListener('click', () => myFunction(all_items[i].Link_Name));
          button.classList.add('custom-button');
        } else if (all_items[i].Type_field === "View | Update") {
          viewUpdateContainer.appendChild(divWrapper);
          button.addEventListener('click', () => parama(all_items[i].Link_Name));
          button.classList.add('custom-button');
        } else {
          idsContainer.appendChild(divWrapper);
          button.addEventListener('click', () => parama(all_items[i].Link_Name));
          button.classList.add('custom-button');
        }
        divWrapper.appendChild(button);
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
            arr["Name"] = arr.fl_dc_no_ref;
            arr["Link_Name"] = "Back_End_Part_DC?fl_dc_no_ref=" + arr.fl_dc_no_ref;
            resultArray.push(arr);
          } else if (arr.fl_job_card_no?.toLowerCase().includes(val.toLowerCase()) || false) {
            arr["Name"] = arr.fl_job_card_no;
            arr["Link_Name"] = "All_Job_Cards?fl_job_card_no=" + arr.fl_job_card_no;
            resultArray.push(arr);
          } else if (arr.fl_work_order_no?.toLowerCase().includes(val.toLowerCase()) || false) {
            arr["Name"] = arr.fl_work_order_no;
            arr["Link_Name"] = "Backend_Work_Orders?fl_work_order_no=" + arr.fl_work_order_no;
            resultArray.push(arr);
          } else {
            resultArray.push(arr);
          }
        });
      });
      console.log(resultArray);
      appendItems(resultArray);
    });



    // Input Actions
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
            arr["Name"] = arr.fl_dc_no_ref;
            arr["Link_Name"] = "Back_End_Part_DC?fl_dc_no_ref=" + arr.fl_dc_no_ref;
            resultArray.push(arr);
          } else if (arr.fl_job_card_no?.toLowerCase().includes(val.toLowerCase()) || false) {
            arr["Name"] = arr.fl_job_card_no;
            arr["Link_Name"] = "All_Job_Cards?fl_job_card_no=" + arr.fl_job_card_no;
            resultArray.push(arr);
          } else if (arr.fl_work_order_no?.toLowerCase().includes(val.toLowerCase()) || false) {
            arr["Name"] = arr.fl_work_order_no;
            arr["Link_Name"] = "Backend_Work_Orders?fl_work_order_no=" + arr.fl_work_order_no;
            resultArray.push(arr);
          } else {
            resultArray.push(arr);
          }
        });
      });
      console.log(resultArray);
      appendItems(resultArray);
    })
  });
