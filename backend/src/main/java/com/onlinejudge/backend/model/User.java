package com.onlinejudge.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Entity
@NoArgsConstructor
@Data
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String contact;
    private String country;
    private String password;
    private String description;
    private String date;
    private String photo;
    @Enumerated(EnumType.STRING)

    @Column(nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Submission> submissions;

    @PrePersist
    protected void onCreate() {
        if (this.date == null) {
            this.date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        }
    }
    public User(Long id, String firstName, String lastName, String username, String email,
                String contact, String country,
                String password, String description, String date, List<Submission> submissions) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.contact = contact;
        this.country = country;
        this.password = password;
        this.description = description;
        this.date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        this.submissions = submissions;
    }
}