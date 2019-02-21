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

#ifndef WIDGETSONG_H
#define WIDGETSONG_H

// -------------------------------------------------------
//
//  CLASS WidgetSong
//
//  Widget used for choosing a song existing in the database.
//
// -------------------------------------------------------

#include <QWidget>
#include <QListWidget>
#include "systemplaysong.h"
#include "systemcommonobject.h"

namespace Ui {
class WidgetSong;
}

class WidgetSong : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetSong(QWidget *parent = nullptr);
    ~WidgetSong();
    void initialize(SystemPlaySong* song);
    void update();
    void openDialog();

private:
    Ui::WidgetSong *ui;
    SystemPlaySong* m_song;
    SongKind m_kind;
    SystemCommonObject* m_object;
    QStandardItemModel* m_parameters;

private slots:
    void on_listWidget_itemDoubleClicked(QListWidgetItem*);
    void on_pushButton_clicked();
};

#endif // WIDGETSONG_H
