package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CaisseRubriqueDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(CaisseRubriqueDTO.class);
        CaisseRubriqueDTO caisseRubriqueDTO1 = new CaisseRubriqueDTO();
        caisseRubriqueDTO1.setId(1L);
        CaisseRubriqueDTO caisseRubriqueDTO2 = new CaisseRubriqueDTO();
        assertThat(caisseRubriqueDTO1).isNotEqualTo(caisseRubriqueDTO2);
        caisseRubriqueDTO2.setId(caisseRubriqueDTO1.getId());
        assertThat(caisseRubriqueDTO1).isEqualTo(caisseRubriqueDTO2);
        caisseRubriqueDTO2.setId(2L);
        assertThat(caisseRubriqueDTO1).isNotEqualTo(caisseRubriqueDTO2);
        caisseRubriqueDTO1.setId(null);
        assertThat(caisseRubriqueDTO1).isNotEqualTo(caisseRubriqueDTO2);
    }
}
