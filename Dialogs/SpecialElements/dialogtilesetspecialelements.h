/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#ifndef DIALOGTILESETSPECIALELEMENTS_H
#define DIALOGTILESETSPECIALELEMENTS_H

#include <QDialog>
#include <QStandardItemModel>
#include "systemtileset.h"

// -------------------------------------------------------
//
//  CLASS DialogTilesetSpecialElements
//
//  A dialog used for setting special elements for a particular tileset.
//
// -------------------------------------------------------

namespace Ui {
class DialogTilesetSpecialElements;
}

class DialogTilesetSpecialElements : public QDialog
{
    Q_OBJECT

public:
    explicit DialogTilesetSpecialElements(SystemTileset* tileset,
                                          QWidget *parent = 0);
    virtual ~DialogTilesetSpecialElements();
    QStandardItemModel* model() const;
    void initialize();
    void move();
    void remove();

private:
    Ui::DialogTilesetSpecialElements *ui;
    SystemTileset* m_tileset;

public slots:
    void on_pushButtonMove_clicked();
    void on_pushButtonDelete_clicked();
    void on_deletingIDs();
    void on_nameChanged(QStandardItem* item);
    virtual void accept();
};

#endif // DIALOGTILESETSPECIALELEMENTS_H
