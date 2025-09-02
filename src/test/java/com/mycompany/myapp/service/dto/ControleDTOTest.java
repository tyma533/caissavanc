package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ControleDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ControleDTO.class);
        ControleDTO controleDTO1 = new ControleDTO();
        controleDTO1.setId(1L);
        ControleDTO controleDTO2 = new ControleDTO();
        assertThat(controleDTO1).isNotEqualTo(controleDTO2);
        controleDTO2.setId(controleDTO1.getId());
        assertThat(controleDTO1).isEqualTo(controleDTO2);
        controleDTO2.setId(2L);
        assertThat(controleDTO1).isNotEqualTo(controleDTO2);
        controleDTO1.setId(null);
        assertThat(controleDTO1).isNotEqualTo(controleDTO2);
    }
}
