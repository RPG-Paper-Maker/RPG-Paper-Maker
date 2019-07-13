/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELDATASSKILL_H
#define PANELDATASSKILL_H

#include <QWidget>
#include "systemcommonskillitem.h"
#include "commonskillitemkind.h"

// -------------------------------------------------------
//
//  CLASS PanelDatasCommonSkillItem
//
//  A panel used for skills, items, weapons, armors,...
//
// -------------------------------------------------------

namespace Ui {
class PanelDatasCommonSkillItem;
}

class PanelDatasCommonSkillItem : public QWidget
{
    Q_OBJECT

public:
    explicit PanelDatasCommonSkillItem(QWidget *parent = nullptr);
    ~PanelDatasCommonSkillItem();

    void initialize(CommonSkillItemKind kind);
    void update(SystemCommonSkillItem *model);
    QStandardItemModel* getTypeModel();
    void updateAllModelsRow();

private:
    Ui::PanelDatasCommonSkillItem *ui;

    void initializeCommonSkill();
    void updateCommonSkill();

protected:
    SystemCommonSkillItem *m_model;
    CommonSkillItemKind m_kind;

public slots:
    void on_comboBoxType_currentIndexChanged(int index);
    void on_checkBoxConsumable_toggled(bool checked);
    void on_checkBoxOneHand_toggled(bool checked);
    void on_comboBoxTarget_currentIndexChanged(int index);
    void on_comboBoxAvailable_currentIndexChanged(int index);
};

#endif // PANELDATASSKILL_H
