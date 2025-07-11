package com.table.table.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.table.table.model.User;
import com.table.table.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException { // Parametre adı
                                                                                              // 'username'
        // Kullanıcıyı email yerine username ile bulmak için
        // userRepository.findByUsername() kullanıyoruz.
        User user = userRepository.findByUsername(username) // <-- BURADA DEĞİŞİKLİK: findByEmail yerine findByUsername
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı: " + username));
        return new UserDetailsImpl(user);
    }
}
