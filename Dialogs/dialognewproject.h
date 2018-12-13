/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#ifndef DIALOGNEWPROJECT_H
#define DIALOGNEWPROJECT_H

#include <QDialog>
#include "controlnewproject.h"

// -------------------------------------------------------
//
//  CLASS DialogNewProject
//
//  A dialog used for creating a new project.
//
// -------------------------------------------------------

namespace Ui {
class DialogNewProject;
}

class DialogNewProject : public QDialog
{
    Q_OBJECT

public:
    explicit DialogNewProject(QWidget *parent = 0);
    ~DialogNewProject();
    void filterDirectoryName(const QString & s);
    QString getProjectName() const;
    QString getDirectoryName() const;
    QString getLocation() const;

private:
    Ui::DialogNewProject *ui;
    ControlNewproject m_control;

private slots:
    void on_lineEditProjectName_textChanged(const QString & s);
    void on_lineEditDirectoryName_editingFinished();
    void on_pushButtonLocation_clicked();
    void accept();
};

#endif // DIALOGNEWPROJECT_H
