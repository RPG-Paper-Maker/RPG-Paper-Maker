/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef PANELSUPERLIST_H
#define PANELSUPERLIST_H

#include <QWidget>
#include <QPushButton>
#include "widgetsuperlist.h"

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
    explicit PanelSuperList(QWidget *parent = nullptr);
    ~PanelSuperList();

    WidgetSuperList * list() const;
    QLineEdit * lineEditName() const;
    QPushButton * buttonMaximum() const;

    void initializeModel(QStandardItemModel *m);
    void showEditName(bool b);
    void showButtonMax(bool b);
    void setMaximumLimit(int max);
    void setIsLang(bool lang);

private:
    Ui::PanelSuperList *ui;
    int m_maximum;
    bool m_isLang;

private slots:
    void on_lineEditName_textChanged(const QString &s);
    void onlangTextChanged(const QString &s);
    void on_pushButtonMaximum_pressed();
    void on_listIndexChanged(QModelIndex index, QModelIndex);

signals:
    void maximumChanged();
    void nameChanged(QStandardItem *);
};

#endif // PANELSUPERLIST_H
