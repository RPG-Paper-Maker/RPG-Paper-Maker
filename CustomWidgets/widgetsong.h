/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
