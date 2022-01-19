/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGVARIABLES_H
#define DIALOGVARIABLES_H

#include <QDialog>
#include <QStandardItemModel>
#include <QAbstractButton>

// -------------------------------------------------------
//
//  CLASS DialogVariables
//
//  A dialog used for managing variables (or switches).
//
// -------------------------------------------------------

namespace Ui {
class DialogVariables;
}

class DialogVariables : public QDialog
{
    Q_OBJECT

public:
    explicit DialogVariables(int id = 1, QWidget *parent = 0);
    ~DialogVariables();
    void initializeModel(QStandardItemModel* m);
    int getSelectedId() const;

private:
    Ui::DialogVariables *ui;
    int m_currentID;

    void translate();

private slots:
    void on_pageSelected(QModelIndex index, QModelIndex);
    void on_buttonBox_clicked(QAbstractButton *button);
};

#endif // DIALOGVARIABLES_H
