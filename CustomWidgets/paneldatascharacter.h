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

#ifndef PANELDATASCHARACTER_H
#define PANELDATASCHARACTER_H

#include <QWidget>
#include "systemhero.h"
#include "panelsuperlist.h"
#include "paneldatasclass.h"

// -------------------------------------------------------
//
//  CLASS PanelDatasCharacter
//
//  The panel for heroes and monsters datas.
//
// -------------------------------------------------------

namespace Ui {
class PanelDatasCharacter;
}

class PanelDatasCharacter : public QWidget
{
    Q_OBJECT

public:
    explicit PanelDatasCharacter(QWidget *parent = nullptr);
    ~PanelDatasCharacter();
    void setPanelSuperList(PanelSuperList *list);
    PanelDatasClass * panelDatasClass() const;
    int finalLevel() const;

    void initialize();
    void update(SystemHero *hero, int classIndex);
    SystemHero * currentHero();
    void updateClasses();
    void updateClass();

private:
    Ui::PanelDatasCharacter *ui;
    PanelSuperList *m_panelSuperList;

private slots:
    void on_comboBoxClass_currentIndexChanged(int index);
    void on_battlerPictureChanged(SystemPicture *picture);
    void on_facesetPictureChanged(SystemPicture* picture);
};

#endif // PANELDATASCHARACTER_H
