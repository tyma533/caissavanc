package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CaisseDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(CaisseDTO.class);
        CaisseDTO caisseDTO1 = new CaisseDTO();
        caisseDTO1.setId(1L);
        CaisseDTO caisseDTO2 = new CaisseDTO();
        assertThat(caisseDTO1).isNotEqualTo(caisseDTO2);
        caisseDTO2.setId(caisseDTO1.getId());
        assertThat(caisseDTO1).isEqualTo(caisseDTO2);
        caisseDTO2.setId(2L);
        assertThat(caisseDTO1).isNotEqualTo(caisseDTO2);
        caisseDTO1.setId(null);
        assertThat(caisseDTO1).isNotEqualTo(caisseDTO2);
    }
}
