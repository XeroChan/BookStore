package com.example.bookstorespringapi.dtos;

public class CredentialsDto {
    private int clientId;
    private String username;
    private String password;
    private boolean isAdmin;

    public CredentialsDto(int clientId, String username, String password, boolean isAdmin) {
        this.clientId = clientId;
        this.username = username;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    public int getclientId() {
        return clientId;
    }

    public void setclientId(int clientId) {
        this.clientId = clientId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }
}

