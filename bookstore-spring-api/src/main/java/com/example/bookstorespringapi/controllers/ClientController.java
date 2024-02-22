package com.example.bookstorespringapi.controllers;

import com.example.bookstorespringapi.dtos.ClientDto;
import com.example.bookstorespringapi.entities.Client;
import com.example.bookstorespringapi.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/clients")
public class ClientController {

    private final ClientService clientService;

    @Autowired
    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }

    @GetMapping("/{id}")
    public Optional<ClientDto> getClientById(@PathVariable int id) {
        Optional<Client> optionalClient = clientService.getClientById(id);
        return optionalClient.map(this::convertToDto);
    }

    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientService.createClient(client);
    }

    @PutMapping("/{id}")
    public Client updateClient(@PathVariable int id, @RequestBody Client newClientData) {
        return clientService.updateClient(id, newClientData);
    }

    @DeleteMapping("/{id}")
    public void deleteClientById(@PathVariable int id) {
        clientService.deleteClientById(id);
    }

    private ClientDto convertToDto(Client client) {
        return new ClientDto(
                client.getName(),
                client.getSurname(),
                client.getEmail(),
                client.getTelephone()
        );
    }
}
