/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGENTERNAMEOPTIONS_H
#define DIALOGENTERNAMEOPTIONS_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogEnterNameOptions
//
//  A dialog used for setting enter name options.
//
// -------------------------------------------------------

namespace Ui {
class DialogEnterNameOptions;
}

class DialogEnterNameOptions : public QDialog
{
    Q_OBJECT

public:
    explicit DialogEnterNameOptions(QList<QList<QString>> &table, QWidget *parent = nullptr);
    ~DialogEnterNameOptions();
    QList<QList<QString>> table() const;

    void translate();

private:
    Ui::DialogEnterNameOptions *ui;

public slots:
    void on_spinBoxRows_valueChanged(int i);
    void on_spinBoxColumns_valueChanged(int i);
};

#endif // DIALOGENTERNAMEOPTIONS_H
