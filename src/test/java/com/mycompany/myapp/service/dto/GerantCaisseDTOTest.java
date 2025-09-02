package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GerantCaisseDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(GerantCaisseDTO.class);
        GerantCaisseDTO gerantCaisseDTO1 = new GerantCaisseDTO();
        gerantCaisseDTO1.setId(1L);
        GerantCaisseDTO gerantCaisseDTO2 = new GerantCaisseDTO();
        assertThat(gerantCaisseDTO1).isNotEqualTo(gerantCaisseDTO2);
        gerantCaisseDTO2.setId(gerantCaisseDTO1.getId());
        assertThat(gerantCaisseDTO1).isEqualTo(gerantCaisseDTO2);
        gerantCaisseDTO2.setId(2L);
        assertThat(gerantCaisseDTO1).isNotEqualTo(gerantCaisseDTO2);
        gerantCaisseDTO1.setId(null);
        assertThat(gerantCaisseDTO1).isNotEqualTo(gerantCaisseDTO2);
    }
}
