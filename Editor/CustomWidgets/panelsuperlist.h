/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    void updateMaximum(int max);

private:
    Ui::PanelSuperList *ui;
    int m_maximum;
    bool m_isLang;

private slots:
    void on_lineEditName_textChanged(const QString &s);
    void onlangTextChanged(const QString &s);
    void on_pushButtonMaximum_pressed();
    void on_pushButtonPlus_pressed();
    void on_pushButtonMinus_pressed();
    void on_listIndexChanged(QModelIndex index, QModelIndex);

signals:
    void maximumChanged();
    void nameChanged(QStandardItem *);
};

#endif // PANELSUPERLIST_H
