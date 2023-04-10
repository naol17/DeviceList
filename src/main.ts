import { DynamicList } from "./DynamicList";
import { RDM_Device } from "./RDM_Device";
import { Server } from "./Server";

window.onload = () => {
  main();
};

var g_Server: Server;
var g_DeviceList: DynamicList;

function main() {
  g_Server = new Server({
    device_added_callback: (device_data: RDM_Device) => {
      // Called when a new RDM Device has been discovered.
      // Create an RDM Device entry in the RDM Device List with the values in device_data.
      console.log("Add Device", device_data);
      var tabledata = helper(device_data);
      document.querySelector(".table_body").innerHTML += tabledata;
    },
    device_updated_callback: (device_data: RDM_Device) => {
      // Called when an RDM Device parameter change is detected.
      // Update existing associated RDM Device entry in the RDM Device List with the values in device_data.
      console.log("Update Device", device_data);
    },
  });

  // Use Server.GetDeviceCount() to get number of devices in backend device list
  console.log("Current Device Count: ", g_Server.GetDeviceCount());
  // Use Server.GetDeviceByIndex() to get backend device by index (index 0 - first added device, index 2 - third added device, ...)
  console.log("First Device: ", g_Server.GetDeviceByIndex(0));

  document.getElementById("filter_none").onclick = () => {
    let tabledata = "";
    var device_data = g_Server.GetDevices();
    for (const index in device_data) {
      tabledata += helper(device_data[index]);
    }

    document.querySelector(".table_body").innerHTML = tabledata;

    console.log("Set DynamicList filter to show all devices");
  };

  document.getElementById("filter_na").onclick = () => {
    let tabledata = "";
    var device_data = g_Server.GetDevices().filter((device) => {
      return device.manufacturer === "Company NA";
    });

    for (const index in device_data) {
      tabledata += helper(device_data[index]);
    }
    document.querySelector(".table_body").innerHTML = tabledata;

    g_Server.UpdateRDMDeviceListTitle(
      g_Server.GetDeviceCount(),
      device_data.length,
      "NA",
      "None"
    );

    console.log(
      'Set DynamicList filter to show devices if RDM_Device.manufacturer == "Company NA"'
    );
  };

  document.getElementById("filter_tmb").onclick = () => {
    let tabledata = "";
    var device_data = g_Server.GetDevices().filter((device) => {
      return device.manufacturer === "TMB";
    });
    console.log(device_data);
    for (const index in device_data) {
      tabledata += helper(device_data[index]);
    }
    document.querySelector(".table_body").innerHTML = tabledata;

    g_Server.UpdateRDMDeviceListTitle(
      g_Server.GetDeviceCount(),
      device_data.length,
      "TMB",
      "None"
    );

    console.log(
      'Set DynamicList filter to show devices if RDM_Device.manufacturer == "TMB"'
    );
  };

  document.getElementById("sort_uid").onclick = () => {
    g_Server.SortByUid();
    let tabledata = "";
    var device_data = g_Server.GetDevices();
    for (const index in device_data) {
      tabledata += helper(device_data[index]);
    }

    document.querySelector(".table_body").innerHTML = tabledata;

    g_Server.UpdateRDMDeviceListTitle(
      g_Server.GetDeviceCount(),
      0,
      "None",
      "Uid"
    );

    console.log("Set DynamicList sort mode to RDM_Device.uid_value");
  };

  document.getElementById("sort_address").onclick = () => {
    g_Server.SortByAddress();
    let tabledata = "";
    var device_data = g_Server.GetDevices();
    for (const index in device_data) {
      tabledata += helper(device_data[index]);
    }

    document.querySelector(".table_body").innerHTML = tabledata;

    g_Server.UpdateRDMDeviceListTitle(
      g_Server.GetDeviceCount(),
      0,
      "None",
      "Address"
    );

    console.log("Set DynamicList sort mode to RDM_Device.address");
  };

  document.getElementById("sort_manufacturer").onclick = () => {
    g_Server.SortByManufacturer();
    let tabledata = "";
    var device_data = g_Server.GetDevices();
    for (const index in device_data) {
      tabledata += helper(device_data[index]);
    }

    document.querySelector(".table_body").innerHTML = tabledata;

    g_Server.UpdateRDMDeviceListTitle(
      g_Server.GetDeviceCount(),
      0,
      "None",
      "Manufacturer"
    );

    console.log("Set DynamicList sort mode to RDM_Device.manufacturer");
  };

  g_DeviceList = new DynamicList(document.getElementById("rdm_device_list"));
}
function helper(device_data: RDM_Device) {
  let tabledata = "";
  var color = device_data.is_online ? "red" : "green";
  tabledata += `<tr class="rdm-list-header na-table-header"> 
                            <th style="padding-left:0.2rem;padding-right:0.2rem;background-color:  ${color}"></th>
                            <th style="padding-left:2.5rem;padding-right:4rem">${device_data.uid}</th>
                            <th style="padding-left:2.5rem;padding-right:4rem; border: 2px solid  gray;">${device_data.label}</th>
                            <th style="padding-left:4rem;padding-right:4rem ">${device_data.manufacturer}</th>
                            <th style="padding-left:5rem;padding-right:6rem">${device_data.model}</th>
                            <th style="padding-left:5rem;padding-right:4rem ;margin-left:10rem; border: 2px solid  gray;">Mode #${device_data.mode_index} </th>
                            
                            <th style="padding-left:2rem"></th>

                            <th style="padding-left:2rem;padding-right:2rem; border: 2px solid  gray;  border-spacing:0 100rem;">${device_data.address}</th>
                        </tr>
            `;
  return tabledata;
}
