package com.mycompany.myapp.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

class OperationMapperTest {

    private OperationMapper operationMapper;

    @BeforeEach
    void setUp() {
        // Récupère l'implémentation générée par MapStruct
        operationMapper = Mappers.getMapper(OperationMapper.class);
    }

    @Test
    void testMapperNotNull() {
        assertThat(operationMapper).isNotNull();
    }
}
