/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    explicit DialogVariables(QWidget *parent = 0);
    ~DialogVariables();
    void initializeModel(QStandardItemModel* m);
    int getSelectedId() const;

private:
    Ui::DialogVariables *ui;

private slots:
    void on_pageSelected(QModelIndex index, QModelIndex);
    void on_buttonBox_clicked(QAbstractButton *button);
};

#endif // DIALOGVARIABLES_H
