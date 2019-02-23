/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
    void initializeCommonSkill();
    void updateCommonSkill();
    QStandardItemModel* getTypeModel();

private:
    Ui::PanelDatasCommonSkillItem *ui;

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
