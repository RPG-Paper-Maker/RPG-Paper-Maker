/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETVARIABLE_H
#define WIDGETVARIABLE_H

#include <QWidget>
#include <QListWidget>
#include "variablesdatas.h"

// -------------------------------------------------------
//
//  CLASS WidgetVariable
//
//  Widget used for choosing a variable existing in the database.
//
// -------------------------------------------------------

namespace Ui {
class WidgetVariable;
}

class WidgetVariable : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetVariable(QWidget *parent = nullptr);
    ~WidgetVariable();
    int currentId() const;
    void setCurrentId(int i);
    QListWidget* list() const;
    void initialize(int i = 1);
    void initializeSuper(SuperListItem *super);
    void openDialog();

private:
    Ui::WidgetVariable *ui;
    int p_currentId;
    SuperListItem *m_super;

private slots:
    void on_listWidget_itemDoubleClicked(QListWidgetItem*);
    void on_pushButton_clicked();
};

#endif // WIDGETVARIABLE_H
