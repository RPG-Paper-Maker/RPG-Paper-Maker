/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
