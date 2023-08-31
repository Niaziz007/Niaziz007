import '../src/style.css'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar, Line, Doughnut } from 'react-chartjs-2';


function Dashboard() {
    const navigate = useNavigate()
    const [pieData, setPieData] = useState({})
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const formattedStartOfMonth = formatDate(startOfMonth);
    var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const formattedCurrentDate = formatDate(lastDay);
    const [fromDate, setFromDate] = useState(formattedStartOfMonth);
    const [toDate, setToDate] = useState(formattedCurrentDate);
    const [employeeData, setEmployeeData] = useState([])
    const [genderWise, setGenderWise] = useState([])


    useEffect(() => {
        getEmployeesData();
    }, []);

    const getEmployeesData = async () => {
        try {
            const response = await axios.get('http://172.16.0.212:3300/dashboard', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
                },
            });
            // console.log(response.data)
            let result = JSON.stringify(response.data)
            console.log(result[0]["Genderwise"]);
            setEmployeeData(response.data['EmployeeData']);
            setGenderWise(response.data['Genderwise']);
            setPieData({
                labels: response.data['Genderwise'].map(item => item['Gender']),
                datasets: [{ label: 'Female', data: response.data['Genderwise'] ? response.data['Genderwise'].map(item => item['EmployeeCount'])[0] : '' },
                { label: 'Male', data: response.data['Genderwise'] ? response.data['Genderwise'].map(item => item['EmployeeCount'])[1] : '' }]
            });
        }
        catch (error) {
            console.log(error)
            if (error.response.status === 401) {
                localStorage.removeItem('access_token');
                navigate('/');
            }
            console.error('Error:', error.response.data);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/')
    }
    return (
        <div className="bg-ofwhite px-lg-5 py-5">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-10">
                        <h2 className="text-center">Current and Required Resource Strength Dashboard</h2>
                    </div>
                    <div className="col-md-2">
                        <button onClick={handleLogout} className="btn btn-green text-white w-100">LogOut</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="bg-white p-4 mt-3 rounded-15 shadow-1">
                            <div className="row gap-3 gap-xl-0">
                                <div className="col-xl-12">
                                    <div className="row gy-3">
                                        <div className="col-lg-2 col-md-6">
                                            <div className="float-label">
                                                <label className="form-label text-uppercase">select practices</label>
                                                <select className="form-select" aria-label="Default select example" defaultValue="1">
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-6">
                                            <div className="float-label">
                                                <label className="form-label text-uppercase">designation category</label>
                                                <select className="form-select" aria-label="Default select example" defaultValue="1">
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-6">
                                            <div className="float-label">
                                                <label className="form-label text-uppercase">supervisor Name</label>
                                                <select className="form-select" aria-label="Default select example" defaultValue="1">
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-6">
                                            <div className="float-label">
                                                <label className="form-label ext-grey">FROM</label>
                                                <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)}></input>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-6">
                                            <div className="float-label">
                                                <label className="form-label ext-grey">TO</label>
                                                <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)}></input>
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-md-3">
                                            <div className="">
                                                <button className="btn btn-green text-white w-100">SEARCH</button>
                                            </div>
                                        </div>
                                        <div className="col-lg-1 col-md-3">
                                            <div className="">
                                                <button className="btn btn-green text-white w-100" >EXPORT</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="align-items-center p-2 bg-white rounded-10 shadow-1 mt-3">
                    <div className="row mt-3">
                        <div className="col-md-4 text-center border-end mt-3">
                            <p className="text-light-grey mt-3 resource-p">Total Active Practices</p>
                            <h5 className="mt-5 resource-number"><span>847</span></h5>
                        </div>
                        <div className="col-md-4 text-center border-end  mt-3">
                            <p className="text-light-grey mt-3 resource-p">Total Revenue</p>
                            <h5 className="mt-5 resource-number-1"><span>43.17M</span></h5>
                        </div>
                        <div className="col-md-4 text-center  mt-3">
                            <p className="text-light-grey mt-3 resource-p">Total Active Employees</p>
                            <h5 className="mt-5 resource-number-2"><span>{employeeData.reduce((total, obj) => total + obj.UserCount, 0)}</span></h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 mt-3">
                        <div className="d-flex flex-column align-items-center bg-white rounded-10 shadow-1 px-5">
                            <p className="text-light-grey mt-3 resource-p">Senior Direction Operation</p>
                            <table className="table text-center table-bordered mb-0">
                                <tbody>
                                    <tr className="border-top-0">
                                        <th className="border-start-0 p-lg-2">Active Resource</th>
                                        <th className="border-end-0 p-lg-2">Average Tenure</th>
                                    </tr>
                                    <tr className="border-bottom-0">
                                        <td className="border-start-0 p-lg-2">
                                            <h5 className=" table-resource-number"><span>{employeeData && employeeData.length > 0 ? employeeData.filter((item) => item.Designation_Name === 'SENIOR DIRECTOR OPERATIONS')[0]["UserCount"] : ''}</span></h5>
                                        </td>
                                        <td className="border-end-0  p-lg-2">
                                            <h5 className=" table-resource-number-1"><span>{employeeData && employeeData.length > 0 ? employeeData.filter((item) => item.Designation_Name === 'SENIOR DIRECTOR OPERATIONS')[0]["AvgTenureYears"] : ''}Yrs</span></h5>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-md-4 mt-3">
                        <div className="d-flex flex-column align-items-center bg-white  rounded-10 shadow-1 px-5">
                            <p className="text-light-grey mt-3 resource-p">Direction Operation</p>
                            <table className="table text-center table-bordered mb-0">
                                <tbody>
                                    <tr className="border-top-0">
                                        <th className="border-start-0  p-lg-2">Active Resource</th>
                                        <th className="border-end-0  p-lg-2">Average Tenure</th>
                                    </tr>
                                    <tr className="border-bottom-0">
                                        <td className="border-start-0 p-lg-2">
                                            <h5 className=" table-resource-number"><span>{employeeData && employeeData.length > 0 ? employeeData.filter((item) => item.Designation_Name === 'DIRECTOR OPERATIONS')[0]["UserCount"] : ''}</span></h5>
                                        </td>
                                        <td className="border-end-0 p-lg-2">
                                            <h5 className=" table-resource-number-1"><span>{employeeData && employeeData.length > 0 ? employeeData.filter((item) => item.Designation_Name === 'DIRECTOR OPERATIONS')[0]["AvgTenureYears"] : ''}Yrs</span></h5>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 mt-3">
                        <div className="d-flex flex-column align-items-center bg-white rounded-10 shadow-1 px-5 h-100">
                            <p className="text-light-grey mt-3 resource-p">Assistant Direction Operation</p>
                            <table className="table text-center table-bordered mb-0">
                                <thead>
                                    <tr className="border-top-0">
                                        <th className="border-start-0 p-lg-2">Active Resource</th>
                                        <th className="border-end-0 p-lg-2">Average Tenure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-bottom-0">
                                        <td className="border-start-0 p-lg-2">
                                            <h5 className="table-resource-number"><span>{employeeData && employeeData.length > 0 ? employeeData.filter((item) => item.Designation_Name === 'ASSISTANT DIRECTOR OPERATIONS')[0]["UserCount"] : ''}</span></h5>
                                        </td>
                                        <td className="border-end-0 p-lg-2">
                                            <h5 className=" table-number-1"><span>{employeeData && employeeData.length > 0 ? employeeData.filter((item) => item.Designation_Name === 'ASSISTANT DIRECTOR OPERATIONS')[0]["AvgTenureYears"] : ''}Yrs</span></h5>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-md-6 mt-3">
                        <div className="d-flex flex-column align-items-center bg-white rounded-10 shadow-1 px-5 h-100">
                            <p className="text-light-grey mt-3 resource-p">Product Manager Operation</p>
                            <table className="table text-center table-bordered mb-0">
                                <thead>
                                    <tr className="border-top-0">
                                        <th className="border-start-0 p-lg-2">Active Resource</th>
                                        <th className="border-end-0 p-lg-2">Average Tenure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-bottom-0">
                                        <td className="border-start-0 p-lg-2">
                                            <h5 className="table-resource-number"><span>{employeeData && employeeData.length > 0 ? employeeData.filter((item) => item.Designation_Name === 'PROJECT MANAGER OPS')[0]["UserCount"] : ''}</span></h5>
                                        </td>
                                        <td className="border-end-0 p-lg-2">
                                            <h5 className=" table-number-1"><span>{employeeData && employeeData.length > 0 ? employeeData.filter((item) => item.Designation_Name === 'PROJECT MANAGER OPS')[0]["AvgTenureYears"] : ''}Yrs</span></h5>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 mt-3">
                        <div className="d-flex flex-column align-items-center bg-white  rounded-10 shadow-1 px-5 h-100">
                            <p className="text-light-grey mt-3 resource-p">Lead Account Manager</p>
                            <table className="table text-center table-bordered mb-0">
                                <thead>
                                    <tr className="border-top-0">
                                        <th className="border-start-0 p-lg-2">Active Resource</th>
                                        <th className="border-end-0 p-lg-2">Average Tenure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-bottom-0">
                                        <td className="border-start-0 p-lg-2">
                                            <h5 className="table-resource-number"><span>{employeeData && employeeData.length > 0 ? employeeData.filter((item) => item.Designation_Name === 'LEAD ACCOUNT MANAGER')[0]["UserCount"] : ''}</span></h5>
                                        </td>
                                        <td className="border-end-0 p-lg-2">
                                            <h5 className=" table-number-1"><span>{employeeData && employeeData.length > 0 ? employeeData.filter((item) => item.Designation_Name === 'LEAD ACCOUNT MANAGER')[0]["AvgTenureYears"] : ''}Yrs</span></h5>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 mt-3">
                        <div className="d-flex flex-column align-items-center bg-white  rounded-10 shadow-1 px-5 h-100">
                            <p className="text-light-grey mt-3 resource-p">Account Manager</p>
                            <table className="table text-center table-bordered mb-0">
                                <thead>
                                    <tr className="border-top-0">
                                        <th className="border-start-0 p-lg-2">Active Resource</th>
                                        <th className="border-end-0 p-lg-2">Average Tenure</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-bottom-0">
                                        <td className="border-start-0 p-lg-2">
                                            <h5 className="table-resource-number"><span>{employeeData && employeeData.length > 0 ? employeeData.filter((item) => item.Designation_Name === 'ACCOUNT MANAGER OPS')[0]['UserCount'] : ''}</span></h5>
                                        </td>
                                        <td className="border-end-0 p-lg-2">
                                            <h5 className="table-number-1"><span>{employeeData && employeeData.length > 0 ? employeeData.filter((item) => item.Designation_Name === 'ACCOUNT MANAGER OPS')[0]['AvgTenureYears'] : ''}Yrs</span></h5>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-2 col-md-4 mt-3">

                        <div className="d-flex flex-column align-items-center p-3 bg-white rounded-10 shadow-1 h-100">
                            <p className="table-heading heading-style">Gender Wise Employee Count</p>
                            {/* <img src="images/sorce-1.png" alt="" className="img-fluid"></img> */}
                            <Doughnut data={pieData} />
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-8 mt-3">
                        <div className="d-flex flex-column align-items-center p-3 bg-white rounded-10 shadow-1">
                            <p className="table-heading heading-style">Designation Wise Employee Count</p>
                            <img src="images/source-2.png" alt="" className="img-fluid"></img>
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-8 mt-3">
                        <div className="d-flex flex-column align-items-center p-3 bg-white rounded-10 shadow-1">
                            <p className="table-heading heading-style">Year Wise Employee Head Count</p>
                            <img src="images/source-3.png" alt="" className="img-fluid"></img>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-2 col-md-4 mt-3">
                        <div className="d-flex flex-column py-3 h-100 bg-white rounded-10 shadow-1">
                            <div className="bg-white rounded-10">
                                <div className="table-header border-bottom p-0">
                                    <p className="table-heading ">Location Wise Employee Count</p>
                                </div>
                                <div className="table-responsive table-custom table-height" style={{ overflow: "auto" }}>
                                    <table className="table table-striped custom-table">
                                        <thead className="position-sticky top-0 bg-white">
                                            <tr className="border-1 tr-p">
                                                <th scope="col">
                                                    <p>City Name</p>
                                                </th>
                                                <th scope="col">
                                                    <p>Resign Count</p>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="tr-td">
                                            <tr className="text-center">
                                                <td>Bagh, Kashimir</td>
                                                <td>17</td>
                                            </tr>
                                            <tr className="text-center">
                                                <td>Rawalpindi, Punjab</td>
                                                <td>10</td>
                                            </tr>
                                            <tr className="text-center">
                                                <td>Peshawar, KPK</td>
                                                <td>06</td>
                                            </tr>
                                            <tr className="text-center">
                                                <td>Muzaffarabad, Kashmir</td>
                                                <td>04</td>
                                            </tr>
                                            <tr className="text-center">
                                                <td>Attock, Punjab</td>
                                                <td>03</td>
                                            </tr>
                                            <tr className="text-center">
                                                <td>Pounch, Kashmir</td>
                                                <td>02</td>
                                            </tr>
                                            <tr className="text-center">
                                                <td>Kotli, Kashmir</td>
                                                <td>05</td>
                                            </tr>
                                            <tr className="text-center">
                                                <td>Mirpur, Kashmir</td>
                                                <td>01</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-8 mt-3">
                        <div className="d-flex flex-column align-items-center p-3 bg-white rounded-10 shadow-1 h-100">
                            <p className="table-heading heading-style">Tenure Wise Employees</p>
                            <img src="images/source-5.png" alt="" className="img-fluid"></img>
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-8 mt-3">
                        <div className="d-flex flex-column align-items-center p-3 bg-white rounded-10 shadow-1 h-100">
                            <p className="table-heading heading-style">Sr. Director Wise Employees Count</p>
                            <img src="images/source-6.png" alt="" className="img-fluid"></img>
                        </div>
                    </div>
                </div>
                <div className="row mt-1 gy-3">
                    <div className="col-lg-12">
                        <div className="bg-white shadow-1 rounded-10">
                            <div className="table-responsive">
                                <table className="table mt-2 table-striped custom-table rounded-10">
                                    <thead className="position-sticky top-0 bg-white">
                                        <tr>
                                            <th scope="col">
                                                <p className="border-start-0">Practices Code</p>
                                            </th>
                                            <th scope="col">
                                                <p>Practice Name</p>
                                            </th>
                                            <th scope="col">
                                                <p>Revenue</p>
                                            </th>
                                            <th scope="col">
                                                <p>Current AMO</p>
                                            </th>
                                            <th scope="col">
                                                <p>Required AMO</p>
                                            </th>
                                            <th scope="col">
                                                <p>Avg. Revenue per AMO</p>
                                            </th>
                                            <th scope="col">
                                                <p>Current LAM</p>
                                            </th>
                                            <th scope="col">
                                                <p>Required LAM</p>
                                            </th>
                                            <th scope="col">
                                                <p>Avg. Revenue per LAM</p>
                                            </th>
                                            <th scope="col">
                                                <p>Current ADO</p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1012714</td>
                                            <td>FOX REHABILITATION</td>
                                            <td>$ 729,930.25</td>
                                            <td>120</td>
                                            <td>104</td>
                                            <td>$ 6,370.00</td>
                                            <td>10</td>
                                            <td>8</td>
                                            <td>$ 90,862.00</td>
                                            <td>5</td>
                                        </tr>
                                        <tr>
                                            <td>1012714</td>
                                            <td>FOX REHABILITATION</td>
                                            <td>$ 729,930.25</td>
                                            <td>120</td>
                                            <td>104</td>
                                            <td>$ 6,370.00</td>
                                            <td>10</td>
                                            <td>8</td>
                                            <td>$ 90,862.00</td>
                                            <td>5</td>
                                        </tr>
                                        <tr>
                                            <td>1012714</td>
                                            <td>FOX REHABILITATION</td>
                                            <td>$ 729,930.25</td>
                                            <td>120</td>
                                            <td>104</td>
                                            <td>$ 6,370.00</td>
                                            <td>10</td>
                                            <td>8</td>
                                            <td>$ 90,862.00</td>
                                            <td>5</td>
                                        </tr>
                                        <tr>
                                            <td>1012714</td>
                                            <td>FOX REHABILITATION</td>
                                            <td>$ 729,930.25</td>
                                            <td>120</td>
                                            <td>104</td>
                                            <td>$ 6,370.00</td>
                                            <td>10</td>
                                            <td>8</td>
                                            <td>$ 90,862.00</td>
                                            <td>5</td>
                                        </tr>
                                        <tr>
                                            <td>1012714</td>
                                            <td>FOX REHABILITATION</td>
                                            <td>$ 729,930.25</td>
                                            <td>120</td>
                                            <td>104</td>
                                            <td>$ 6,370.00</td>
                                            <td>10</td>
                                            <td>8</td>
                                            <td>$ 90,862.00</td>
                                            <td>5</td>
                                        </tr>
                                        <tr>
                                            <td>1012714</td>
                                            <td>FOX REHABILITATION</td>
                                            <td>$ 729,930.25</td>
                                            <td>120</td>
                                            <td>104</td>
                                            <td>$ 6,370.00</td>
                                            <td>10</td>
                                            <td>8</td>
                                            <td>$ 90,862.00</td>
                                            <td>5</td>
                                        </tr>
                                        <tr>
                                            <td>1012714</td>
                                            <td>FOX REHABILITATION</td>
                                            <td>$ 729,930.25</td>
                                            <td>120</td>
                                            <td>104</td>
                                            <td>$ 6,370.00</td>
                                            <td>10</td>
                                            <td>8</td>
                                            <td>$ 90,862.00</td>
                                            <td>5</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-1 gy-3">
                    <div className="col-lg-12">
                        <div className="bg-white shadow-1 rounded-10">
                            <div className="table-responsive">
                                <table className="table mt-2 table-striped custom-table rounded-10">
                                    <thead className="position-sticky top-0 bg-white">
                                        <tr>
                                            <th scope="col">
                                                <p className="border-start-0">Practices Code</p>
                                            </th>
                                            <th scope="col">
                                                <p>Practice Name</p>
                                            </th>
                                            <th scope="col">
                                                <p>Employee ID</p>
                                            </th>
                                            <th scope="col">
                                                <p>Employee Name</p>
                                            </th>
                                            <th scope="col">
                                                <p>Designation</p>
                                            </th>
                                            <th scope="col">
                                                <p>Utilization</p>
                                            </th>
                                            <th scope="col">
                                                <p>Specialty</p>
                                            </th>
                                            <th scope="col">
                                                <p>Revenue Contribution</p>
                                            </th>
                                            <th scope="col">
                                                <p>Role</p>
                                            </th>
                                            <th scope="col">
                                                <p>Experience</p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1012714</td>
                                            <td>FOX REHABILITATION</td>
                                            <td>9436</td>
                                            <td>Saqib Masood</td>
                                            <td>Saqib Masood</td>
                                            <td>0.5</td>
                                            <td>Rehabilitation</td>
                                            <td>$ 90,862.00</td>
                                            <td>Charges</td>
                                            <td>1.3 Yrs</td>
                                        </tr>
                                        <tr>
                                            <td>1012714</td>
                                            <td>FOX REHABILITATION</td>
                                            <td>9436</td>
                                            <td>Saqib Masood</td>
                                            <td>Saqib Masood</td>
                                            <td>0.5</td>
                                            <td>Rehabilitation</td>
                                            <td>$ 90,862.00</td>
                                            <td>Charges</td>
                                            <td>1.3 Yrs</td>
                                        </tr>
                                        <tr>
                                            <td>1012714</td>
                                            <td>FOX REHABILITATION</td>
                                            <td>9436</td>
                                            <td>Saqib Masood</td>
                                            <td>Saqib Masood</td>
                                            <td>0.5</td>
                                            <td>Rehabilitation</td>
                                            <td>$ 90,862.00</td>
                                            <td>Charges</td>
                                            <td>1.3 Yrs</td>
                                        </tr>
                                        <tr>
                                            <td>1012714</td>
                                            <td>FOX REHABILITATION</td>
                                            <td>9436</td>
                                            <td>Saqib Masood</td>
                                            <td>Saqib Masood</td>
                                            <td>0.5</td>
                                            <td>Rehabilitation</td>
                                            <td>$ 90,862.00</td>
                                            <td>Charges</td>
                                            <td>1.3 Yrs</td>
                                        </tr>
                                        <tr>
                                            <td>1012714</td>
                                            <td>FOX REHABILITATION</td>
                                            <td>9436</td>
                                            <td>Saqib Masood</td>
                                            <td>Saqib Masood</td>
                                            <td>0.5</td>
                                            <td>Rehabilitation</td>
                                            <td>$ 90,862.00</td>
                                            <td>Charges</td>
                                            <td>1.3 Yrs</td>
                                        </tr>
                                        <tr>
                                            <td>1012714</td>
                                            <td>FOX REHABILITATION</td>
                                            <td>9436</td>
                                            <td>Saqib Masood</td>
                                            <td>Saqib Masood</td>
                                            <td>0.5</td>
                                            <td>Rehabilitation</td>
                                            <td>$ 90,862.00</td>
                                            <td>Charges</td>
                                            <td>1.3 Yrs</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>




            </div>
        </div>
    );
}
export default Dashboard;