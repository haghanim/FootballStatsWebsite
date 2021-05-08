import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import api from '../api';

function PlayerProfile() {
    let { playerId } = useParams();


    // api.players.getPlayerProfile(playerId);

    return (
        <h1>
            {playerId}
        </h1>
    )
}

{/* <div className="page-content p-5" id="content">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="h2 card-title">Account Settings</h1>
                            <hr />
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-sm">
                                            <h6>Username</h6>
                                        </div>
                                        <div className="col-sm">
                                            <h6 className="text-muted">{this.state.username}</h6>
                                        </div>
                                        <div className="col-sm">
                                        </div>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-sm">
                                            <h6>Name</h6>
                                        </div>
                                        <div className="col-sm">
                                            <h6 className="text-muted">{this.state.name}</h6>
                                        </div>
                                        <div className="col-sm">
                                            <a href="#"><h6 className="text-right">Edit</h6></a>
                                        </div>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-sm">
                                            <h6>Email</h6>
                                        </div>
                                        <div className="col-sm">
                                            <h6 className="text-muted">{this.state.email}</h6>
                                        </div>
                                        <div className="col-sm">
                                            <a href="#"><h6 className="text-right">Edit</h6></a>
                                        </div>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-sm">
                                            <h6>Avatar</h6>
                                        </div>
                                        <div className="col-sm">
                                            <a href="#"><h6>View Avatar</h6></a>
                                        </div>
                                        <div className="col-sm">
                                            <button onClick={this.onEditAvatarClick}> Edit </button>
                                            <a href="#"><h6 className="text-right">Edit</h6></a>
                                        </div>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-sm">
                                            <h6>Bio</h6>
                                        </div>
                                        <div className="col-sm">
                                            <h6 className="text-muted">Student at University of Pennsylvania</h6>
                                        </div>
                                        <div className="col-sm">
                                            <a href="#"><h6 className="text-right">Edit</h6></a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {this.state.editAvatarActive && edit_avatar_component}
                    <div className="card mt-4">
                        <div className="card-body">
                            <h1 className="h2 card-title">Reset Password</h1>
                            <hr />
                                <div className="form-group">
                                    <label htmlFor="oldPassword">Old Password</label>
                                    <input type="password" className="form-control" id="oldPassword" onChange={this.onOldPasswordInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input type="password" className="form-control" id="newPassword" onChange={this.onNewPasswordInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="newPasswordConfirm">Confirm New Password</label>
                                    <input type="password" className="form-control" id="newPasswordConfirm" onChange={this.onConfNewPasswordInputChange} />
                                    <small id="passHelp" className="form-text text-muted">Make sure it's at least 15
                                                characters.</small>
                                </div>
                                <button className="btn btn-primary" onClick={this.onChangePasswordBtnPressed}>Submit</button>
                        </div>
                    </div>
                    <div className="card mt-4">
                        <div className="card-body">
                            <h1 className="h2 card-title text-danger">Delete Account</h1>
                            <hr />
                            <button type="button" className="btn btn-outline-danger mb-1">Delete Account</button>
                            <br />
                            <small id="deleteHelp" className="text-muted">Are you sure you want to delete your
                                        account?</small>
                        </div>
                    </div>
                </div> */}

export default PlayerProfile;