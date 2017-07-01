#ifndef PANELSUPERLIST_H
#define PANELSUPERLIST_H

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

#include <QWidget>
#include <QPushButton>
#include <widgetsuperlist.h>

// -------------------------------------------------------
//
//  CLASS PanelSuperList
//
//  A panel of a particar list wich can have buttons bellow.
//  It is used a lot in datas manager.
//
// -------------------------------------------------------

namespace Ui {
class PanelSuperList;
}

class PanelSuperList : public QWidget
{
    Q_OBJECT

public:
    explicit PanelSuperList(QWidget *parent = 0);
    ~PanelSuperList();
    void initializeModel(QStandardItemModel* m);
    WidgetSuperList* list() const;
    QLineEdit* lineEditName() const;
    QPushButton* buttonMaximum() const;
    void showEditName(bool b);
    void showButtonMax(bool b);
    void setMaximumLimit(int max);

private:
    Ui::PanelSuperList *ui;
    int m_maximum;

private slots:
    void on_lineEditName_textChanged(const QString & s);
    void on_pushButtonMaximum_pressed();
    void on_listIndexChanged(QModelIndex index, QModelIndex);

signals:
    void maximumChanged();
};

#endif // PANELSUPERLIST_H
