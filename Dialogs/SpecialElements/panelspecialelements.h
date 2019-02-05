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

#ifndef PANELSPECIALELEMENTS_H
#define PANELSPECIALELEMENTS_H

#include <QWidget>
#include "systemspritewall.h"
#include "panelsuperlist.h"

// -------------------------------------------------------
//
//  CLASS PanelSpecialElements
//
//  The special elements panel (complete list).
//
// -------------------------------------------------------

namespace Ui {
class PanelSpecialElements;
}

class PanelSpecialElements : public QWidget
{
    Q_OBJECT

public:
    explicit PanelSpecialElements(QWidget *parent = 0);
    ~PanelSpecialElements();
    void initialize(QStandardItemModel* model, PictureKind kind);
    void update(SystemSpecialElement *sys);
    int currentIndex() const;
    PanelSuperList* superList() const;

private:
    Ui::PanelSpecialElements *ui;
    QStandardItemModel* m_model;
    PictureKind m_kind;

private slots:
    void on_pageSelected(QModelIndex index, QModelIndex);
    void on_pictureChanged(SystemPicture* picture);
};

#endif // PANELSPECIALELEMENTS_H
