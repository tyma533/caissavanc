package com.mycompany.myapp.service.mapper;

import org.junit.jupiter.api.BeforeEach;

class CaisseMapperTest {

    private CaisseMapper caisseMapper;

    @BeforeEach
    public void setUp() {
        caisseMapper = new CaisseMapperImpl();
    }
}
