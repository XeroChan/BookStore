package com.example.bookstorespringapi.services;

import com.example.bookstorespringapi.dtos.ClientDto;
import com.example.bookstorespringapi.entities.Client;
import com.example.bookstorespringapi.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    @Autowired
    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Optional<Client> getClientById(int id) {
        return clientRepository.findById(id);
    }

    public Client createClient(Client client) {
        return clientRepository.save(client);
    }

    public Client updateClient(int id, Client newClientData) {
        Optional<Client> optionalClient = clientRepository.findById(id);
        if (optionalClient.isPresent()) {
            Client existingClient = optionalClient.get();
            existingClient.setName(newClientData.getName());
            existingClient.setSurname(newClientData.getSurname());
            existingClient.setEmail(newClientData.getEmail());
            existingClient.setTelephone(newClientData.getTelephone());
            return clientRepository.save(existingClient);
        } else {
            // Handle the case when the client with the given id doesn't exist
            // You can throw an exception, return null, or handle it differently based on your use case
            return null;
        }
    }

    public void deleteClientById(int id) {
        clientRepository.deleteById(id);
    }
}
