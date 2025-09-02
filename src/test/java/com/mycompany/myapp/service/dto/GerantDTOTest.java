package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GerantDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(GerantDTO.class);
        GerantDTO gerantDTO1 = new GerantDTO();
        gerantDTO1.setId(1L);
        GerantDTO gerantDTO2 = new GerantDTO();
        assertThat(gerantDTO1).isNotEqualTo(gerantDTO2);
        gerantDTO2.setId(gerantDTO1.getId());
        assertThat(gerantDTO1).isEqualTo(gerantDTO2);
        gerantDTO2.setId(2L);
        assertThat(gerantDTO1).isNotEqualTo(gerantDTO2);
        gerantDTO1.setId(null);
        assertThat(gerantDTO1).isNotEqualTo(gerantDTO2);
    }
}
