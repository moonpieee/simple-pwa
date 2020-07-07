// @ts-ignore
let myObj = {
    pageNo: 1
}
var dataSet = [];
const loadMore = document.getElementById('btnGetMoreData');
const reset = document.getElementById('btnReset');
const container = document.querySelector(".txn-container");
const userInfo = document.querySelector(".customerinfo");
const API = {
    'GET_CUSTOMER_INFO': 'https://training.rupeek.com/getcustomerinfo',
    'GET_TRANSACTION_INFO': 'https://training.rupeek.com/gettxninfo/' // accepts params /{userid}/{page}
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("././sw.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}

class RUPEEK {
    constructor() { }
    getCustomerInfo() {
        return fetch(API.GET_CUSTOMER_INFO).then(res => res.json());
    }
    getCustomerTransactionInfo(userId, pageNo) {
        return fetch(API.GET_TRANSACTION_INFO + `${userId}/${pageNo}`).then(res => res.json());
    }

    generateTransactionHTML(StatusVal, statusClass, data) {
        return `<div class="col-xs-12 col-sm-4"><div class="card shadow alert alert-${statusClass} border border-secondary">
                    <div class="card-body p-1">
                        <div class="d-flex">
                            <div class="card-title">Status : <span class="font-weight-bold">${StatusVal}</span></div>
                            <div class="font-weight-bold text-dark ml-auto">23 Aug 2019</div>
                        </div>
                        <hr>
                            <div class="d-flex">
                                <div class="card-no">HDFC Bank | ${data.account_no} </div><span
                                    class="badge badge-${statusClass} font-weight-bold ml-auto">₹ ${data.amount}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    generateCustomerInfoHtml(user) {
        let h3 = document.createElement('h3');
        h3.className = "float-left";
        h3.innerText = `Customer Name : ${user.name} 
                        Id : ${user.toUserId}`;
        document.getElementsByClassName('customerinfo')[0].appendChild(h3)
    }

    async rebuildDataset(data, newData) {
        return await data.push(...newData);
    }

    resetPage() {
        myObj.pageNo = 1;
        dataSet = [];
        let alert = `<div class="alert alert-info w-50 mt-5 text-center mx-auto">
            <strong>Page Data Reset Successfully !! </strong> .
        </div>`
        container.innerHTML = "";
        container.innerHTML = alert;
        setTimeout(() => {
            container.innerHTML = "";
        }, 1000)
    }
}

let R = new RUPEEK();
async function loadMoreData(page) {
    return await R.getCustomerTransactionInfo(myObj['user']['toUserId'], page);
}

// get user details on page load and save in an object
document.addEventListener("DOMContentLoaded", () => {
    R.getCustomerInfo().then((user) => {
        myObj['user'] = user;
        R.generateCustomerInfoHtml(user);
    });
});

// reset event
reset.addEventListener("click", () => { R.resetPage() });

// load more data event
loadMore.addEventListener("click", () => {
    loadMoreData(myObj.pageNo).then(({ result }) => {
        R.rebuildDataset(dataSet, result).then((d) => {
            myObj.pageNo = (myObj.pageNo + 1);
            console.log('next page no', myObj.pageNo);
            let items = "";
            dataSet.forEach((el) => {
                let statusClass = ""
                switch (el.transactionStatusId) {
                    case 1:
                        statusClass = "success";
                        items += R.generateTransactionHTML('Success', statusClass, el);
                        break;
                    case 4:
                        statusClass = "danger";
                        items += R.generateTransactionHTML('Failure', statusClass, el);
                        break;
                    default:
                        break;
                }
            });
            container.innerHTML = items;
        });
    }).catch((err) => {
        alert("Error in fetching data !!")
    });
});



